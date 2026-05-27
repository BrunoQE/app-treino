import historico from "../models/Historico.js";
import Anthropic from '@anthropic-ai/sdk';
import CacheIA from '../models/CacheIA.js';

class HistoricoController {

    // POST /historico — salva treino finalizado
    static async salvarHistorico(req, res) {
        try {
            console.log('usuario: ', req.usuario._id);
            const novoHistorico = await historico.create({
                ...req.body,
                usuario: req.usuario._id
            });
            console.log('novo historico: ', novoHistorico);
            res.status(201).json({ message: "Histórico salvo com sucesso", historico: novoHistorico });
        } catch (error) {
            console.error('ERRO:', error);
            res.status(500).json({ message: error.message });
        }
    }

    // GET /historico — lista histórico do usuário
    static async listarHistorico(req, res) {
        try {
            const listaHistorico = await historico
                .find({ usuario: req.usuario._id })
                .sort({ dataFim: -1 })
                .exec();
            res.status(200).json(listaHistorico);
        } catch (error) {
            console.error('ERRO:', error);
            res.status(500).json({ message: error.message });
        }
    }

    // GET /historico/stats — estatísticas gerais do usuário
    static async buscarStats(req, res) {
        try {
            const registros = await historico.find({ usuario: req.usuario._id });
            const totalTreinos = registros.length;
            const totalMinutos = registros.reduce((acc, r) => acc + r.duracaoMinutos, 0);
            const totalHoras = Math.floor(totalMinutos / 60);
            const minutosRestantes = totalMinutos % 60;
            res.status(200).json({
                totalTreinos,
                totalMinutos,
                totalHoras,
                minutosRestantes,
                tempoFormatado: `${totalHoras}h ${minutosRestantes}min`
            });
        } catch (error) {
            console.error('ERRO:', error);
            res.status(500).json({ message: error.message });
        }
    }

    // GET /historico/streak — dias consecutivos treinando
    static async buscarStreak(req, res) {
        try {
            const registros = await historico
                .find({ usuario: req.usuario._id })
                .sort({ dataFim: -1 })
                .exec();

            if (registros.length === 0) {
                return res.status(200).json({ streak: 0, recordeStreak: 0 });
            }

            const diasTreinados = [...new Set(
                registros.map(r => new Date(r.dataFim).toLocaleDateString('pt-BR'))
            )];

            const hoje = new Date();
            const ontem = new Date(hoje);
            ontem.setDate(hoje.getDate() - 1);

            const treinouHoje = diasTreinados.includes(hoje.toLocaleDateString('pt-BR'));
            const treinouOntem = diasTreinados.includes(ontem.toLocaleDateString('pt-BR'));

            if (!treinouHoje && !treinouOntem) {
                return res.status(200).json({ streak: 0, recordeStreak: calcularRecorde(diasTreinados) });
            }

            const diaInicio = treinouHoje ? hoje : ontem;
            let streak = 0;

            for (let i = 0; i < diasTreinados.length; i++) {
                const diaEsperado = new Date(diaInicio);
                diaEsperado.setDate(diaInicio.getDate() - i);
                const diaEsperadoStr = diaEsperado.toLocaleDateString('pt-BR');
                if (diasTreinados.includes(diaEsperadoStr)) streak++;
                else break;
            }

            res.status(200).json({ streak, recordeStreak: calcularRecorde(diasTreinados) });
        } catch (error) {
            console.error('ERRO:', error);
            res.status(500).json({ message: error.message });
        }
    }

    // GET /historico/recordes
    static async buscarRecordes(req, res) {
        try {
            const historicos = await historico.find({ usuario: req.usuario._id })
                .sort({ dataFim: -1 }).exec();
            const recordes = {};
            historicos.forEach(h => {
                h.exerciciosRealizados.forEach(ex => {
                    if (!ex.peso) return;
                    if (!recordes[ex.nome] || ex.peso > recordes[ex.nome]) {
                        recordes[ex.nome] = ex.peso;
                    }
                });
            });
            res.status(200).json(recordes);
        } catch (error) {
            console.error('ERRO:', error);
            res.status(500).json({ message: error.message });
        }
    }

    // GET /historico/evolucao
    static async buscarEvolucao(req, res) {
        try {
            const historicos = await historico
                .find({ usuario: req.usuario._id })
                .sort({ dataFim: 1 }).exec();

            const evolucao = {};
            historicos.forEach(h => {
                h.exerciciosRealizados.forEach(ex => {
                    if (!ex.peso) return;
                    if (!evolucao[ex.nome]) evolucao[ex.nome] = [];
                    evolucao[ex.nome].push({ data: h.dataFim, peso: ex.peso });
                });
            });

            const resultado = {};
            Object.keys(evolucao).forEach(nome => {
                if (evolucao[nome].length >= 1) resultado[nome] = evolucao[nome];
            });

            res.status(200).json(resultado);
        } catch (error) {
            console.error('ERRO:', error);
            res.status(500).json({ message: error.message });
        }
    }

    // GET /historico/sugestoes/:treinoId
    static async buscarSugestoesIA(req, res) {
        try {
            const { treinoId } = req.params;
            const historicos = await historico
                .find({ usuario: req.usuario._id, treino: treinoId })
                .sort({ dataFim: -1 }).limit(3).exec();

            if (historicos.length < 3) {
                return res.status(200).json({ sugestoes: [] });
            }

            const sugestoes = [];
            const exerciciosUltimo = historicos[0].exerciciosRealizados;

            for (const ex of exerciciosUltimo) {
                if (!ex.peso) continue;
                const pesos = historicos.map(h => {
                    const encontrado = h.exerciciosRealizados.find(e => e.nome === ex.nome);
                    return encontrado?.peso ?? null;
                });
                const todosMesmoPeso = pesos.every(p => p !== null && p === pesos[0]);
                if (!todosMesmoPeso) continue;
                const pesoAtual = ex.peso;
                const incremento = pesoAtual < 20 ? 2.5 : pesoAtual < 60 ? 5 : 10;
                sugestoes.push({
                    nome: ex.nome,
                    grupoMuscular: ex.grupoMuscular,
                    pesoAtual,
                    pesoSugerido: pesoAtual + incremento,
                    incremento,
                });
            }

            res.status(200).json({ sugestoes });
        } catch (error) {
            console.error('ERRO:', error);
            res.status(500).json({ message: error.message });
        }
    }

    // ── ANALYTICS PRO ────────────────────────────────────────────────

    // GET /historico/volume-semanal
    // Retorna volume total (kg) por grupo muscular nas últimas 8 semanas
    static async buscarVolumeSemanal(req, res) {
        try {
            const oitoSemanasAtras = new Date();
            oitoSemanasAtras.setDate(oitoSemanasAtras.getDate() - 56);

            const historicos = await historico
                .find({
                    usuario: req.usuario._id,
                    dataFim: { $gte: oitoSemanasAtras }
                })
                .sort({ dataFim: 1 })
                .exec();

            // Agrupa por semana e grupo muscular
            const semanas = {};

            historicos.forEach(h => {
                const data = new Date(h.dataFim);
                // Início da semana (domingo)
                const domingo = new Date(data);
                domingo.setDate(data.getDate() - data.getDay());
                domingo.setHours(0, 0, 0, 0);
                const chave = domingo.toISOString().split('T')[0];

                if (!semanas[chave]) semanas[chave] = {};

                h.exerciciosRealizados.forEach(ex => {
                    if (!ex.peso || !ex.grupoMuscular) return;
                    const grupo = ex.grupoMuscular;
                    const volume = ex.peso * (parseInt(ex.serie) || 1) * (parseInt(ex.repeticoes) || 1);
                    semanas[chave][grupo] = (semanas[chave][grupo] ?? 0) + volume;
                });
            });

            // Formata resultado com label da semana
            const resultado = Object.entries(semanas)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([dataInicio, grupos]) => {
                    const d = new Date(dataInicio);
                    const fim = new Date(d);
                    fim.setDate(d.getDate() + 6);
                    return {
                        semana: `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`,
                        dataInicio,
                        grupos,
                        totalKg: Object.values(grupos).reduce((a, b) => a + b, 0),
                    };
                });

            res.status(200).json(resultado);
        } catch (error) {
            console.error('ERRO:', error);
            res.status(500).json({ message: error.message });
        }
    }

    // GET /historico/frequencia-mensal
    // Retorna quantos treinos e minutos por mês nos últimos 6 meses
    static async buscarFrequenciaMensal(req, res) {
        try {
            const seisMesesAtras = new Date();
            seisMesesAtras.setMonth(seisMesesAtras.getMonth() - 5);
            seisMesesAtras.setDate(1);
            seisMesesAtras.setHours(0, 0, 0, 0);

            const historicos = await historico
                .find({
                    usuario: req.usuario._id,
                    dataFim: { $gte: seisMesesAtras }
                })
                .sort({ dataFim: 1 })
                .exec();

            const meses = {};

            historicos.forEach(h => {
                const d = new Date(h.dataFim);
                const chave = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
                if (!meses[chave]) meses[chave] = { treinos: 0, minutos: 0 };
                meses[chave].treinos += 1;
                meses[chave].minutos += h.duracaoMinutos ?? 0;
            });

            // Garante que todos os 6 meses aparecem mesmo sem treino
            const resultado = [];
            for (let i = 5; i >= 0; i--) {
                const d = new Date();
                d.setMonth(d.getMonth() - i);
                const chave = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
                const nomeMes = d.toLocaleDateString('pt-BR', { month: 'short' })
                    .replace('.', '')
                    .toUpperCase();
                resultado.push({
                    chave,
                    mes: nomeMes,
                    treinos: meses[chave]?.treinos ?? 0,
                    minutos: meses[chave]?.minutos ?? 0,
                });
            }

            res.status(200).json(resultado);
        } catch (error) {
            console.error('ERRO:', error);
            res.status(500).json({ message: error.message });
        }
    }

    // GET /historico/comparativo-semanal
    // Compara semana atual vs semana anterior
    static async buscarComparativoSemanal(req, res) {
        try {
            const hoje = new Date();

            // Início da semana atual (domingo)
            const inicioSemanaAtual = new Date(hoje);
            inicioSemanaAtual.setDate(hoje.getDate() - hoje.getDay());
            inicioSemanaAtual.setHours(0, 0, 0, 0);

            // Início da semana anterior
            const inicioSemanaAnterior = new Date(inicioSemanaAtual);
            inicioSemanaAnterior.setDate(inicioSemanaAtual.getDate() - 7);

            const historicos = await historico
                .find({
                    usuario: req.usuario._id,
                    dataFim: { $gte: inicioSemanaAnterior }
                })
                .exec();

            function calcularSemana(registros) {
                const treinos = registros.length;
                const minutos = registros.reduce((a, r) => a + (r.duracaoMinutos ?? 0), 0);
                const volume = registros.reduce((a, r) => {
                    return a + r.exerciciosRealizados.reduce((b, ex) => {
                        if (!ex.peso) return b;
                        return b + ex.peso * (parseInt(ex.serie) || 1) * (parseInt(ex.repeticoes) || 1);
                    }, 0);
                }, 0);
                const grupos = new Set();
                registros.forEach(r => {
                    r.exerciciosRealizados.forEach(ex => {
                        if (ex.grupoMuscular) grupos.add(ex.grupoMuscular);
                    });
                });
                return { treinos, minutos, volume: Math.round(volume), grupos: grupos.size };
            }

            const semanaAtual = historicos.filter(h => new Date(h.dataFim) >= inicioSemanaAtual);
            const semanaAnterior = historicos.filter(h => {
                const d = new Date(h.dataFim);
                return d >= inicioSemanaAnterior && d < inicioSemanaAtual;
            });

            const atual = calcularSemana(semanaAtual);
            const anterior = calcularSemana(semanaAnterior);

            function delta(a, b) {
                if (b === 0) return a > 0 ? 100 : 0;
                return Math.round(((a - b) / b) * 100);
            }

            res.status(200).json({
                atual,
                anterior,
                delta: {
                    treinos: delta(atual.treinos, anterior.treinos),
                    minutos: delta(atual.minutos, anterior.minutos),
                    volume: delta(atual.volume, anterior.volume),
                    grupos: delta(atual.grupos, anterior.grupos),
                }
            });
        } catch (error) {
            console.error('ERRO:', error);
            res.status(500).json({ message: error.message });
        }
    }

    // ── ADICIONA ESSE MÉTODO NO HistoricoController.js ──────────────────
    // Adiciona também a rota no historicoRoutes.js:
    // routes.get("/historico/personal-ia", HistoricoController.buscarPersonalIA);

    // GET /historico/personal-ia
    // Analisa o histórico e retorna insights personalizados
    // Substitui o método buscarPersonalIA no HistoricoController.js
    // Adiciona no topo do arquivo:
    // import Anthropic from '@anthropic-ai/sdk';

    // const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    // ── ADICIONA NO TOPO DO HistoricoController.js ──────────────────────
    // import Anthropic from '@anthropic-ai/sdk';
    // import CacheIA from '../models/CacheIA.js';

    // ── SUBSTITUI o método buscarPersonalIA ─────────────────────────────

    static async buscarPersonalIA(req, res) {
        try {
            const CACHE_HORAS = 2;

            // ── Verifica cache ────────────────────────────────────────────
            const cacheExistente = await CacheIA.findOne({
                usuario: req.usuario._id,
                tipo: 'personal_ia',
            });

            if (cacheExistente) {
                const idadeHoras = (Date.now() - new Date(cacheExistente.criadoEm)) / (1000 * 60 * 60);
                if (idadeHoras < CACHE_HORAS) {
                    console.log(`[Personal IA] Cache válido (${idadeHoras.toFixed(1)}h) para ${req.usuario._id}`);
                    return res.status(200).json({
                        ...cacheExistente.resultado,
                        fromCache: true,
                        cacheIdade: `${Math.round(idadeHoras * 60)} minutos`,
                    });
                }
                // Cache expirado — deleta
                await CacheIA.deleteOne({ _id: cacheExistente._id });
            }

            // ── Busca histórico ───────────────────────────────────────────
            const hoje = new Date();
            const sessenta = new Date();
            sessenta.setDate(hoje.getDate() - 60);

            const historicos = await historico
                .find({ usuario: req.usuario._id, dataFim: { $gte: sessenta } })
                .sort({ dataFim: -1 })
                .exec();

            if (historicos.length === 0) {
                return res.status(200).json({
                    insights: [],
                    proximoTreino: null,
                    resumo: 'Nenhum treino registrado nos últimos 60 dias.',
                    geradoPorIA: false,
                    fromCache: false,
                });
            }

            // ── Prepara dados para a IA ───────────────────────────────────
            const totalTreinos = historicos.length;
            const mediaMinutos = Math.round(historicos.reduce((a, h) => a + h.duracaoMinutos, 0) / totalTreinos);

            const ultimoTreinoPorGrupo = {};
            historicos.forEach(h => {
                h.exerciciosRealizados.forEach(ex => {
                    if (!ex.grupoMuscular) return;
                    if (!ultimoTreinoPorGrupo[ex.grupoMuscular]) {
                        ultimoTreinoPorGrupo[ex.grupoMuscular] = h.dataFim;
                    }
                });
            });

            const gruposComDias = Object.entries(ultimoTreinoPorGrupo).map(([grupo, data]) => ({
                grupo,
                diasSemTreinar: Math.floor((hoje - new Date(data)) / (1000 * 60 * 60 * 24)),
            })).sort((a, b) => b.diasSemTreinar - a.diasSemTreinar);

            const evolucaoPorExercicio = {};
            [...historicos].reverse().forEach(h => {
                h.exerciciosRealizados.forEach(ex => {
                    if (!ex.peso || !ex.nome) return;
                    if (!evolucaoPorExercicio[ex.nome]) evolucaoPorExercicio[ex.nome] = [];
                    evolucaoPorExercicio[ex.nome].push(ex.peso);
                });
            });

            const exerciciosComEvolucao = Object.entries(evolucaoPorExercicio)
                .filter(([, pesos]) => pesos.length >= 2)
                .map(([nome, pesos]) => ({
                    nome,
                    pesoInicial: pesos[0],
                    pesoAtual: pesos[pesos.length - 1],
                    evolucao: pesos[pesos.length - 1] - pesos[0],
                    estagnado: pesos.slice(-3).every(p => p === pesos[pesos.length - 1]) && pesos.length >= 3,
                }));

            const inicioSemana = new Date(hoje);
            inicioSemana.setDate(hoje.getDate() - hoje.getDay());
            inicioSemana.setHours(0, 0, 0, 0);
            const treinosSemana = historicos.filter(h => new Date(h.dataFim) >= inicioSemana);
            const diasTreinadosSemana = new Set(treinosSemana.map(h => new Date(h.dataFim).toLocaleDateString('pt-BR'))).size;

            const contagemGrupos = {};
            historicos.forEach(h => {
                h.exerciciosRealizados.forEach(ex => {
                    if (ex.grupoMuscular) contagemGrupos[ex.grupoMuscular] = (contagemGrupos[ex.grupoMuscular] ?? 0) + 1;
                });
            });
            const grupoMaisTreinado = Object.entries(contagemGrupos).sort(([, a], [, b]) => b - a)[0]?.[0] ?? null;

            const resumo = { treinos60dias: totalTreinos, mediaMinutos, grupoMaisTreinado, diasTreinadosSemana };

            // ── Chama Claude Haiku ────────────────────────────────────────
            try {
                const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

                const dadosParaIA = {
                    periodo: '60 dias',
                    totalTreinos,
                    mediaMinutosPorTreino: mediaMinutos,
                    diasTreinadosEstaSemana: diasTreinadosSemana,
                    grupoMaisTreinado,
                    gruposMusculares: gruposComDias,
                    exerciciosComEvolucao: exerciciosComEvolucao.slice(0, 10),
                };

                const prompt = `Você é um personal trainer experiente e motivador. Analise os dados de treino abaixo e responda APENAS com um JSON válido, sem texto antes ou depois.

Dados do usuário:
${JSON.stringify(dadosParaIA, null, 2)}

Responda com este JSON exato:
{
  "insights": [
    {
      "tipo": "negligenciado|estagnacao|evolucao|consistencia|alerta|periodizacao",
      "emoji": "emoji aqui",
      "titulo": "título curto",
      "descricao": "descrição clara e motivadora em português",
      "acao": "sugestão prática e específica",
      "grupos": ["grupo1"]
    }
  ],
  "proximoTreino": {
    "grupo": "nome do grupo muscular",
    "motivo": "motivo curto e claro"
  },
  "periodizacao": {
    "recomendacao": "deload|manter|intensificar|mudar_programa",
    "motivo": "explicação clara em português",
    "sugestao": "sugestão prática específica"
  }
}

Regras:
- Máximo 4 insights
- Seja direto, motivador e específico
- Use dados reais do histórico
- Priorize: grupos negligenciados > estagnação > evolução positiva > consistência
- Se treinar há mais de 6 semanas sem deload, sugira periodização
- Responda sempre em português brasileiro`;

                const response = await anthropic.messages.create({
                    model: 'claude-haiku-4-5-20251001',
                    max_tokens: 1000,
                    messages: [{ role: 'user', content: prompt }],
                });

                const textoResposta = response.content[0].text.trim();
                const jsonLimpo = textoResposta.replace(/```json|```/g, '').trim();
                const iaResposta = JSON.parse(jsonLimpo);

                const resultado = {
                    insights: iaResposta.insights ?? [],
                    proximoTreino: iaResposta.proximoTreino ?? null,
                    periodizacao: iaResposta.periodizacao ?? null,
                    resumo,
                    geradoPorIA: true,
                    fromCache: false,
                };

                // ── Salva no cache ────────────────────────────────────────
                await CacheIA.create({
                    usuario: req.usuario._id,
                    tipo: 'personal_ia',
                    resultado,
                    criadoEm: new Date(),
                });

                console.log(`[Personal IA] Gerado por IA e cacheado para ${req.usuario._id}`);
                return res.status(200).json(resultado);

            } catch (erroIA) {
                console.error('[Personal IA] Erro Claude API, usando fallback:', erroIA.message);

                // ── Fallback: algoritmo de regras ─────────────────────────
                const insights = [];
                const negligenciados = gruposComDias.filter(g => g.diasSemTreinar >= 7).slice(0, 3);
                if (negligenciados.length > 0) {
                    insights.push({
                        tipo: 'negligenciado', emoji: '⚠️',
                        titulo: 'Grupos sem atenção',
                        descricao: `${negligenciados.map(g => `${g.grupo} (${g.diasSemTreinar}d)`).join(', ')} sem treinar.`,
                        acao: `Que tal incluir ${negligenciados[0].grupo} no próximo treino?`,
                        grupos: negligenciados.map(g => g.grupo),
                    });
                }

                const estagnados = exerciciosComEvolucao.filter(e => e.estagnado).slice(0, 2);
                if (estagnados.length > 0) {
                    insights.push({
                        tipo: 'estagnacao', emoji: '📊',
                        titulo: 'Carga estagnada',
                        descricao: `${estagnados.map(e => `${e.nome} (${e.pesoAtual}kg)`).join(', ')} com mesmo peso há 3+ treinos.`,
                        acao: 'Tente aumentar o peso ou as repetições na próxima sessão.',
                    });
                }

                const evoluindo = exerciciosComEvolucao.filter(e => e.evolucao > 0 && !e.estagnado).slice(0, 2);
                if (evoluindo.length > 0) {
                    insights.push({
                        tipo: 'evolucao', emoji: '🚀',
                        titulo: 'Você está evoluindo!',
                        descricao: `${evoluindo.map(e => `${e.nome} +${e.evolucao}kg`).join(' · ')}`,
                        acao: 'Continue assim! A consistência está trazendo resultados.',
                    });
                }

                if (diasTreinadosSemana >= 4) {
                    insights.push({ tipo: 'consistencia', emoji: '🔥', titulo: 'Semana incrível!', descricao: `Você já treinou ${diasTreinadosSemana} dias essa semana.`, acao: 'Mantenha o ritmo!' });
                } else if (diasTreinadosSemana === 0) {
                    insights.push({ tipo: 'alerta', emoji: '💤', titulo: 'Nenhum treino essa semana', descricao: 'Você ainda não treinou essa semana.', acao: 'Que tal retomar hoje?' });
                }

                const proximoTreino = negligenciados.length > 0
                    ? { grupo: negligenciados[0].grupo, motivo: `${negligenciados[0].diasSemTreinar} dias sem treinar este grupo` }
                    : null;

                return res.status(200).json({ insights, proximoTreino, resumo, geradoPorIA: false, fromCache: false });
            }

        } catch (error) {
            console.error('ERRO:', error);
            res.status(500).json({ message: error.message });
        }
    }

    // ── ADICIONA NO HistoricoController.js ──────────────────────────────
    // Novo método: buscarAnalyticsIA
    // Nova rota: GET /historico/analytics-ia

    static async buscarAnalyticsIA(req, res) {
        try {
            const CACHE_HORAS = 2;

            // ── Verifica cache ────────────────────────────────────────────
            const cacheExistente = await CacheIA.findOne({
                usuario: req.usuario._id,
                tipo: 'analytics_ia',
            });

            if (cacheExistente) {
                const idadeHoras = (Date.now() - new Date(cacheExistente.criadoEm)) / (1000 * 60 * 60);
                if (idadeHoras < CACHE_HORAS) {
                    console.log(`[Analytics IA] Cache válido (${idadeHoras.toFixed(1)}h)`);
                    return res.status(200).json({ ...cacheExistente.resultado, fromCache: true });
                }
                await CacheIA.deleteOne({ _id: cacheExistente._id });
            }

            // ── Busca dados ───────────────────────────────────────────────
            const hoje = new Date();

            // Semana atual
            const inicioSemanaAtual = new Date(hoje);
            inicioSemanaAtual.setDate(hoje.getDate() - hoje.getDay());
            inicioSemanaAtual.setHours(0, 0, 0, 0);

            // Semana anterior
            const inicioSemanaAnterior = new Date(inicioSemanaAtual);
            inicioSemanaAnterior.setDate(inicioSemanaAtual.getDate() - 7);

            // Últimas 8 semanas
            const oitoSemanasAtras = new Date();
            oitoSemanasAtras.setDate(hoje.getDate() - 56);

            // Últimos 6 meses
            const seisMesesAtras = new Date();
            seisMesesAtras.setMonth(seisMesesAtras.getMonth() - 5);

            const [historicosRecentes, historicosMeses] = await Promise.all([
                historico.find({ usuario: req.usuario._id, dataFim: { $gte: oitoSemanasAtras } }).sort({ dataFim: -1 }).exec(),
                historico.find({ usuario: req.usuario._id, dataFim: { $gte: seisMesesAtras } }).sort({ dataFim: 1 }).exec(),
            ]);

            if (historicosRecentes.length === 0) {
                return res.status(200).json({
                    resumo: null,
                    geradoPorIA: false,
                    fromCache: false,
                });
            }

            // Calcula métricas
            const semanaAtual = historicosRecentes.filter(h => new Date(h.dataFim) >= inicioSemanaAtual);
            const semanaAnterior = historicosRecentes.filter(h => {
                const d = new Date(h.dataFim);
                return d >= inicioSemanaAnterior && d < inicioSemanaAtual;
            });

            function calcularSemana(registros) {
                const treinos = registros.length;
                const minutos = registros.reduce((a, r) => a + (r.duracaoMinutos ?? 0), 0);
                const volume = registros.reduce((a, r) => {
                    return a + r.exerciciosRealizados.reduce((b, ex) => {
                        if (!ex.peso) return b;
                        return b + ex.peso * (parseInt(ex.serie) || 1) * (parseInt(ex.repeticoes) || 1);
                    }, 0);
                }, 0);
                const grupos = new Set();
                registros.forEach(r => r.exerciciosRealizados.forEach(ex => { if (ex.grupoMuscular) grupos.add(ex.grupoMuscular); }));
                return { treinos, minutos, volume: Math.round(volume), grupos: grupos.size };
            }

            const atual = calcularSemana(semanaAtual);
            const anterior = calcularSemana(semanaAnterior);

            // Volume por grupo nas últimas 8 semanas
            const volumePorGrupo = {};
            historicosRecentes.forEach(h => {
                h.exerciciosRealizados.forEach(ex => {
                    if (!ex.peso || !ex.grupoMuscular) return;
                    const v = ex.peso * (parseInt(ex.serie) || 1) * (parseInt(ex.repeticoes) || 1);
                    volumePorGrupo[ex.grupoMuscular] = (volumePorGrupo[ex.grupoMuscular] ?? 0) + v;
                });
            });

            const gruposOrdenados = Object.entries(volumePorGrupo)
                .sort(([, a], [, b]) => b - a)
                .map(([grupo, volume]) => ({ grupo, volume: Math.round(volume) }));

            // Treinos por mês
            const treinosPorMes = {};
            historicosMeses.forEach(h => {
                const d = new Date(h.dataFim);
                const chave = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
                treinosPorMes[chave] = (treinosPorMes[chave] ?? 0) + 1;
            });

            const mesesComTreino = Object.values(treinosPorMes);
            const mediaMensal = mesesComTreino.length > 0
                ? Math.round(mesesComTreino.reduce((a, b) => a + b, 0) / mesesComTreino.length)
                : 0;
            const melhorMes = Math.max(...mesesComTreino, 0);

            const dadosParaIA = {
                semanaAtual: atual,
                semanaAnterior: anterior,
                deltaTreinos: anterior.treinos > 0 ? Math.round(((atual.treinos - anterior.treinos) / anterior.treinos) * 100) : 0,
                deltaVolume: anterior.volume > 0 ? Math.round(((atual.volume - anterior.volume) / anterior.volume) * 100) : 0,
                gruposMaisTrabalhadosUltimas8Semanas: gruposOrdenados.slice(0, 5),
                gruposMenosTrabalhadosUltimas8Semanas: gruposOrdenados.slice(-3).reverse(),
                mediaTreinosMensal: mediaMensal,
                melhorMesTreinos: melhorMes,
                totalTreinos8Semanas: historicosRecentes.length,
            };

            // ── Chama Claude Haiku ────────────────────────────────────────
            try {
                const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

                const prompt = `Você é um personal trainer analítico e motivador. Analise os dados de performance abaixo e responda APENAS com um JSON válido.

Dados:
${JSON.stringify(dadosParaIA, null, 2)}

Responda com este JSON:
{
  "titulo": "título curto e impactante (max 6 palavras)",
  "resumo": "análise personalizada em 2-3 frases, direta e motivadora, citando números reais",
  "destaque": "1 ponto positivo específico com número real",
  "alerta": "1 ponto de atenção específico (ou null se tudo ok)",
  "tendencia": "crescendo|estavel|declinando",
  "dica": "1 sugestão prática e específica baseada nos dados"
}

Regras:
- Use os números reais dos dados
- Seja direto e motivador
- Compare semana atual com anterior
- Destaque o grupo mais e menos trabalhado
- Responda em português brasileiro`;

                const response = await anthropic.messages.create({
                    model: 'claude-haiku-4-5-20251001',
                    max_tokens: 500,
                    messages: [{ role: 'user', content: prompt }],
                });

                const textoResposta = response.content[0].text.trim();
                const jsonLimpo = textoResposta.replace(/```json|```/g, '').trim();
                const iaResposta = JSON.parse(jsonLimpo);

                const resultado = {
                    resumo: iaResposta,
                    dadosMetricas: dadosParaIA,
                    geradoPorIA: true,
                    fromCache: false,
                };

                await CacheIA.create({
                    usuario: req.usuario._id,
                    tipo: 'analytics_ia',
                    resultado,
                    criadoEm: new Date(),
                });

                console.log(`[Analytics IA] Gerado por IA e cacheado`);
                return res.status(200).json(resultado);

            } catch (erroIA) {
                console.error('[Analytics IA] Erro Claude API:', erroIA.message);
                return res.status(200).json({
                    resumo: null,
                    dadosMetricas: dadosParaIA,
                    geradoPorIA: false,
                    fromCache: false,
                });
            }

        } catch (error) {
            console.error('ERRO:', error);
            res.status(500).json({ message: error.message });
        }
    }
}

function calcularRecorde(diasTreinados) {
    if (diasTreinados.length === 0) return 0;
    let recordeStreak = 1;
    let streakAtual = 1;
    for (let i = 1; i < diasTreinados.length; i++) {
        const diaAnterior = new Date(diasTreinados[i - 1].split('/').reverse().join('-'));
        const diaAtual = new Date(diasTreinados[i].split('/').reverse().join('-'));
        const diffDias = Math.round((diaAnterior - diaAtual) / (1000 * 60 * 60 * 24));
        if (diffDias === 1) {
            streakAtual++;
            if (streakAtual > recordeStreak) recordeStreak = streakAtual;
        } else {
            streakAtual = 1;
        }
    }
    return recordeStreak;
}

export default HistoricoController;