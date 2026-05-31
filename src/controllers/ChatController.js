import Anthropic from "@anthropic-ai/sdk";
import ChatMensagem from "../models/ChatMensagem.js";
import Historico from "../models/Historico.js";
import Treino from "../models/Treino.js";
import Usuario from "../models/Usuario.js";
import exercicio from "../models/Exercicios.js";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const LIMITE_MENSAGENS_DIA = 30;

// Monta o contexto resumido do usuário para a IA
async function montarContexto(usuarioId) {
    const usuario = await Usuario.findById(usuarioId).lean();

    // Histórico dos últimos 60 dias
    const sessenta = new Date();
    sessenta.setDate(sessenta.getDate() - 60);
    const historico = await Historico.find({
        usuario: usuarioId,
        dataFim: { $gte: sessenta }
    }).sort({ dataFim: -1 }).limit(50).lean();

    // Recordes por exercício
    const recordes = {};
    historico.forEach(h => {
        h.exerciciosRealizados?.forEach(ex => {
            if (ex.peso && ex.nome) {
                if (!recordes[ex.nome] || ex.peso > recordes[ex.nome]) {
                    recordes[ex.nome] = ex.peso;
                }
            }
        });
    });

    // Grupos mais treinados
    const gruposContados = {};
    historico.forEach(h => {
        h.exerciciosRealizados?.forEach(ex => {
            if (ex.grupoMuscular) {
                gruposContados[ex.grupoMuscular] = (gruposContados[ex.grupoMuscular] ?? 0) + 1;
            }
        });
    });
    const gruposFavoritos = Object.entries(gruposContados)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([g]) => g);

    // Programa ativo e treinos
    const treinos = await Treino.find({ usuario: usuarioId }).lean();

    return {
        nome: usuario.nome?.split(' ')[0] ?? 'Atleta',
        objetivo: usuario.objetivo ?? null,
        nivel: usuario.nivel ?? null,
        treinos60dias: historico.length,
        gruposFavoritos,
        recordes,
        treinos: treinos.map(t => ({
            nome: t.nome,
            diaSugerido: t.diaSugerido,
            totalExercicios: t.exercicios?.length ?? 0,
        })),
    };
}

// Monta o system prompt com contexto do usuário
function montarSystemPrompt(contexto) {
    return `Você é o Personal IA do app Treino Absoluto, um assistente especializado em treino físico e fitness.

PERFIL DO USUÁRIO:
- Nome: ${contexto.nome}
- Objetivo: ${contexto.objetivo ?? 'não informado'}
- Nível: ${contexto.nivel ?? 'não informado'}
- Treinos nos últimos 60 dias: ${contexto.treinos60dias}
- Grupos favoritos: ${contexto.gruposFavoritos.join(', ') || 'nenhum ainda'}
- Recordes pessoais: ${Object.entries(contexto.recordes).slice(0, 10).map(([ex, kg]) => `${ex}: ${kg}kg`).join(', ') || 'nenhum ainda'}
- Programa atual: ${contexto.treinos.length > 0 ? contexto.treinos.map(t => `${t.nome} (${t.diaSugerido ?? 'sem dia'}, ${t.totalExercicios} exercícios)`).join(', ') : 'sem treinos cadastrados'}

SUAS RESPONSABILIDADES:
- Responder dúvidas sobre treino, exercícios, recuperação e performance
- Sugerir exercícios e ajustes baseados no perfil e histórico do usuário
- Orientar sobre dores musculares e cuidados com o corpo
- Analisar o progresso e motivar o usuário
- Ajudar a montar ou ajustar rotinas de treino

LIMITAÇÕES IMPORTANTES:
- NÃO faça diagnósticos médicos — oriente a buscar um médico quando necessário
- NÃO prescreva suplementos específicos com dosagens
- NÃO responda assuntos fora de fitness, treino e saúde relacionada
- Seja direto e objetivo — respostas curtas e práticas

Responda sempre em português brasileiro, com linguagem próxima e motivadora.`;
}

class ChatController {

    // POST /chat/mensagem — envia mensagem e recebe resposta da IA
    static async enviarMensagem(req, res) {
        try {
            const { mensagem } = req.body;
            const usuarioId = req.usuario._id;

            if (!mensagem?.trim()) {
                return res.status(400).json({ message: 'Mensagem não pode estar vazia.' });
            }

            // Verificar plano Pro
            const usuario = await Usuario.findById(usuarioId);
            if (usuario.plano !== 'pro' || (usuario.planoExpira && new Date() > usuario.planoExpira)) {
                return res.status(403).json({ message: 'Recurso exclusivo do plano Pro.' });
            }

            // Verificar limite diário
            const inicioDia = new Date();
            inicioDia.setHours(0, 0, 0, 0);
            const mensagensHoje = await ChatMensagem.countDocuments({
                usuario: usuarioId,
                role: 'user',
                createdAt: { $gte: inicioDia }
            });

            if (mensagensHoje >= LIMITE_MENSAGENS_DIA) {
                return res.status(429).json({
                    message: 'Limite diário de mensagens atingido.',
                    limite: LIMITE_MENSAGENS_DIA,
                    usadas: mensagensHoje,
                });
            }

            // Buscar histórico da conversa (últimas 8 trocas = 16 mensagens)
            const historicoChat = await ChatMensagem.find({ usuario: usuarioId })
                .sort({ createdAt: -1 })
                .limit(16)
                .lean();
            const mensagensAnteriores = historicoChat.reverse().map(m => ({
                role: m.role,
                content: m.conteudo,
            }));

            // Montar contexto e system prompt
            const contexto = await montarContexto(usuarioId);
            const systemPrompt = montarSystemPrompt(contexto);

            // Verificar se precisa buscar exercícios (palavras-chave)
            const precisaExercicios = /exerc[ií]cio|treino|substituir|alternativa|grupo muscular/i.test(mensagem);
            let exerciciosContexto = '';
            if (precisaExercicios) {
                // Extrai grupo muscular da mensagem se mencionar
                const gruposConhecidos = ['peito', 'costas', 'pernas', 'quadríceps', 'glúteos', 'bíceps', 'tríceps', 'ombros', 'abdominais', 'panturrilhas', 'lombar'];
                const grupoMencionado = gruposConhecidos.find(g => mensagem.toLowerCase().includes(g));
                if (grupoMencionado) {
                    const exs = await exercicio.find({
                        grupoMuscular: { $regex: grupoMencionado, $options: 'i' },
                        gifUrl: { $exists: true }
                    }).limit(8).lean();
                    if (exs.length > 0) {
                        exerciciosContexto = `\n\nEXERCÍCIOS DISPONÍVEIS NO APP (${grupoMencionado}):\n${exs.map(e => `- ${e.nome} (${e.equipamento ?? 'sem equipamento'}, ${e.dificuldade})`).join('\n')}`;
                    }
                }
            }

            // Salvar mensagem do usuário
            await ChatMensagem.create({ usuario: usuarioId, role: 'user', conteudo: mensagem.trim() });

            // Chamar Claude Haiku
            const resposta = await anthropic.messages.create({
                model: 'claude-haiku-4-5-20251001',
                max_tokens: 600,
                system: systemPrompt + exerciciosContexto,
                messages: [
                    ...mensagensAnteriores,
                    { role: 'user', content: mensagem.trim() },
                ],
            });

            const textoResposta = resposta.content[0]?.text ?? 'Não consegui gerar uma resposta. Tente novamente.';

            // Salvar resposta da IA
            await ChatMensagem.create({ usuario: usuarioId, role: 'assistant', conteudo: textoResposta });

            res.status(200).json({
                resposta: textoResposta,
                mensagensUsadas: mensagensHoje + 1,
                mensagensRestantes: LIMITE_MENSAGENS_DIA - (mensagensHoje + 1),
            });

        } catch (error) {
            console.error('Erro no chat IA:', error);
            res.status(500).json({ message: `${error.message} - falha no chat` });
        }
    }

    // GET /chat/historico — retorna histórico da conversa
    static async buscarHistorico(req, res) {
        try {
            const mensagens = await ChatMensagem.find({ usuario: req.usuario._id })
                .sort({ createdAt: 1 })
                .lean();

            // Mensagens usadas hoje
            const inicioDia = new Date();
            inicioDia.setHours(0, 0, 0, 0);
            const usadasHoje = await ChatMensagem.countDocuments({
                usuario: req.usuario._id,
                role: 'user',
                createdAt: { $gte: inicioDia }
            });

            res.status(200).json({
                mensagens: mensagens.map(m => ({
                    _id: m._id,
                    role: m.role,
                    conteudo: m.conteudo,
                    createdAt: m.createdAt,
                })),
                mensagensUsadas: usadasHoje,
                mensagensRestantes: Math.max(0, LIMITE_MENSAGENS_DIA - usadasHoje),
                limite: LIMITE_MENSAGENS_DIA,
            });
        } catch (error) {
            res.status(500).json({ message: `${error.message} - falha ao buscar histórico` });
        }
    }

    // DELETE /chat/historico — limpa histórico da conversa
    static async limparHistorico(req, res) {
        try {
            await ChatMensagem.deleteMany({ usuario: req.usuario._id });
            res.status(200).json({ message: 'Histórico limpo com sucesso.' });
        } catch (error) {
            res.status(500).json({ message: `${error.message} - falha ao limpar histórico` });
        }
    }
}

export default ChatController;