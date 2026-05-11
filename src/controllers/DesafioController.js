import Desafio from '../models/Desafio.js';
import historico from '../models/Historico.js';

// Calcula semana atual no formato "2026-W20"
function getSemanaAtual() {
    const agora = new Date();
    const inicio = new Date(agora.getFullYear(), 0, 1);
    const semana = Math.ceil((((agora - inicio) / 86400000) + inicio.getDay() + 1) / 7);
    return `${agora.getFullYear()}-W${semana.toString().padStart(2, '0')}`;
}

// Define nível baseado no total de treinos
function getNivel(totalTreinos) {
    if (totalTreinos < 10) return 'Iniciante';
    if (totalTreinos < 30) return 'Intermediario';
    return 'Avancado';
}

// Gera desafios baseados no nível
function gerarDesafios(nivel) {
    const desafiosPorNivel = {
        Iniciante: [
            { tipo: 'treinos_semana', descricao: 'Complete 2 treinos essa semana', meta: 2, pontos: 10 },
            { tipo: 'dias_seguidos', descricao: 'Treine 2 dias seguidos', meta: 2, pontos: 15 },
            { tipo: 'duracao', descricao: 'Complete um treino de pelo menos 20 minutos', meta: 20, pontos: 10 },
        ],
        Intermediario: [
            { tipo: 'treinos_semana', descricao: 'Complete 4 treinos essa semana', meta: 4, pontos: 20 },
            { tipo: 'dias_seguidos', descricao: 'Treine 3 dias seguidos', meta: 3, pontos: 25 },
            { tipo: 'duracao', descricao: 'Complete um treino acima de 40 minutos', meta: 40, pontos: 20 },
        ],
        Avancado: [
            { tipo: 'treinos_semana', descricao: 'Complete 5 treinos essa semana', meta: 5, pontos: 30 },
            { tipo: 'dias_seguidos', descricao: 'Treine 4 dias seguidos', meta: 4, pontos: 35 },
            { tipo: 'duracao', descricao: 'Complete um treino acima de 60 minutos', meta: 60, pontos: 30 },
        ],
    };
    return desafiosPorNivel[nivel];
}

class DesafioController {

    // GET /desafios — busca ou cria desafios da semana atual
    static async buscarDesafios(req, res) {
        try {
            const semana = getSemanaAtual();

            // Verifica se já existe desafio para essa semana
            let desafioSemana = await Desafio.findOne({
                usuario: req.usuario._id,
                semana,
            });

            if (!desafioSemana) {
                // Calcula nível baseado no total de treinos
                const totalTreinos = await historico.countDocuments({ usuario: req.usuario._id });
                const nivel = getNivel(totalTreinos);
                const desafios = gerarDesafios(nivel);

                desafioSemana = await Desafio.create({
                    usuario: req.usuario._id,
                    semana,
                    nivel,
                    desafios,
                });
            }

            // Atualiza progresso dos desafios
            await atualizarProgresso(desafioSemana, req.usuario._id);

            // Busca novamente com progresso atualizado
            desafioSemana = await Desafio.findOne({ usuario: req.usuario._id, semana });

            res.status(200).json(desafioSemana);
        } catch (error) {
            console.error('ERRO:', error);
            res.status(500).json({ message: error.message });
        }
    }

    // GET /desafios/historico — todos os desafios anteriores
    static async buscarHistorico(req, res) {
        try {
            const desafios = await Desafio.find({ usuario: req.usuario._id })
                .sort({ createdAt: -1 })
                .limit(10);
            res.status(200).json(desafios);
        } catch (error) {
            console.error('ERRO:', error);
            res.status(500).json({ message: error.message });
        }
    }
}

// Atualiza progresso de cada desafio baseado no histórico da semana
async function atualizarProgresso(desafioSemana, usuarioId) {
    const inicioSemana = getInicioSemana();
    const fimSemana = getFimSemana();

    const treinosSemana = await historico.find({
        usuario: usuarioId,
        dataFim: { $gte: inicioSemana, $lte: fimSemana },
    }).sort({ dataFim: 1 });

    let atualizado = false;

    for (const desafio of desafioSemana.desafios) {
        if (desafio.concluido) continue;

        let progresso = 0;

        if (desafio.tipo === 'treinos_semana') {
            progresso = treinosSemana.length;
        }

        if (desafio.tipo === 'dias_seguidos') {
            progresso = calcularDiasSeguidos(treinosSemana);
        }

        if (desafio.tipo === 'duracao') {
            const maiorDuracao = treinosSemana.reduce((max, t) =>
                t.duracaoMinutos > max ? t.duracaoMinutos : max, 0);
            progresso = maiorDuracao;
        }

        desafio.progresso = Math.min(progresso, desafio.meta);
        if (progresso >= desafio.meta) {
            desafio.concluido = true;
            atualizado = true;
        }
    }

    // Verifica se todos os desafios foram concluídos
    const todosConcluidos = desafioSemana.desafios.every(d => d.concluido);
    if (todosConcluidos && !desafioSemana.concluido) {
        desafioSemana.concluido = true;
        desafioSemana.badges.push('semana_de_fogo');
        atualizado = true;
    }

    if (atualizado) {
        await desafioSemana.save();
    }
}

function getInicioSemana() {
    const hoje = new Date();
    const dia = hoje.getDay();
    const diff = hoje.getDate() - dia + (dia === 0 ? -6 : 1);
    const inicio = new Date(hoje.setDate(diff));
    inicio.setHours(0, 0, 0, 0);
    return inicio;
}

function getFimSemana() {
    const inicio = getInicioSemana();
    const fim = new Date(inicio);
    fim.setDate(inicio.getDate() + 6);
    fim.setHours(23, 59, 59, 999);
    return fim;
}

function calcularDiasSeguidos(treinos) {
    if (treinos.length === 0) return 0;
    const dias = [...new Set(treinos.map(t =>
        new Date(t.dataFim).toLocaleDateString('pt-BR')
    ))];
    let maxSeguidos = 1;
    let atual = 1;
    for (let i = 1; i < dias.length; i++) {
        const diaAnterior = new Date(dias[i - 1].split('/').reverse().join('-'));
        const diaAtual = new Date(dias[i].split('/').reverse().join('-'));
        const diff = Math.round((diaAtual - diaAnterior) / (1000 * 60 * 60 * 24));
        if (diff === 1) {
            atual++;
            if (atual > maxSeguidos) maxSeguidos = atual;
        } else {
            atual = 1;
        }
    }
    return maxSeguidos;
}

export default DesafioController;