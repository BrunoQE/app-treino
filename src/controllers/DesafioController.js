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
            { tipo: 'dias_seguidos', descricao: 'Treine 2 dias seguidos nessa semana', meta: 2, pontos: 15 },
            { tipo: 'duracao', descricao: 'Complete 1 treino de pelo menos 20 minutos', meta: 20, pontos: 10 },
        ],
        Intermediario: [
            { tipo: 'treinos_semana', descricao: 'Complete 4 treinos essa semana', meta: 4, pontos: 20 },
            { tipo: 'dias_seguidos', descricao: 'Treine 3 dias seguidos nessa semana', meta: 3, pontos: 25 },
            { tipo: 'duracao', descricao: 'Complete 1 treino de pelo menos 40 minutos', meta: 40, pontos: 20 },
        ],
        Avancado: [
            { tipo: 'treinos_semana', descricao: 'Complete 5 treinos essa semana', meta: 5, pontos: 30 },
            { tipo: 'dias_seguidos', descricao: 'Treine 4 dias seguidos nessa semana', meta: 4, pontos: 35 },
            { tipo: 'duracao', descricao: 'Complete 1 treino de pelo menos 60 minutos', meta: 60, pontos: 30 },
        ],
    };
    return desafiosPorNivel[nivel];
}

// Definição dos badges e suas metas
const BADGES_CONQUISTA = {
    dedicado: {
        nome: 'Dedicado',
        emoji_bronze: '🔥',
        emoji_prata: '🔥🔥',
        emoji_ouro: '🔥🔥🔥',
        descricao: 'Dias de streak',
        metas: { bronze: 7, prata: 14, ouro: 30 },
        tipo: 'streak',
    },
    forte: {
        nome: 'Forte',
        emoji_bronze: '💪',
        emoji_prata: '💪💪',
        emoji_ouro: '💪💪💪',
        descricao: 'Treinos completados',
        metas: { bronze: 10, prata: 30, ouro: 100 },
        tipo: 'total_treinos',
    },
    resistente: {
        nome: 'Resistente',
        emoji_bronze: '⏱',
        emoji_prata: '⏱⏱',
        emoji_ouro: '⏱⏱⏱',
        descricao: 'Treinos acima de 30 minutos',
        metas: { bronze: 1, prata: 5, ouro: 20 },
        tipo: 'treinos_longos',
    },
    consistente: {
        nome: 'Consistente',
        emoji_bronze: '📅',
        emoji_prata: '📅📅',
        emoji_ouro: '📅📅📅',
        descricao: 'Semanas de desafios completadas',
        metas: { bronze: 2, prata: 5, ouro: 10 },
        tipo: 'semanas_desafios',
    },
    evoluido: {
        nome: 'Evoluído',
        emoji_bronze: '⚡',
        emoji_prata: '⚡⚡',
        emoji_ouro: '⚡⚡⚡',
        descricao: 'Recordes pessoais quebrados',
        metas: { bronze: 1, prata: 10, ouro: 50 },
        tipo: 'recordes',
    },
};

const GRUPOS_MUSCULARES = [
    'Peito', 'Costas', 'Pernas', 'Biceps', 'Triceps', 'Ombros', 'Abdominais'
];

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

    static async buscarBadgesConquistados(req, res) {
        try {
            const usuarioId = req.usuario._id;

            // Dados necessários para calcular badges
            const [historicos, desafios] = await Promise.all([
                historico.find({ usuario: usuarioId }),
                Desafio.find({ usuario: usuarioId }),
                historico.find({ usuario: usuarioId }),
            ]);

            // Calcula métricas
            const totalTreinos = historicos.length;

            // Streak atual
            const diasTreinados = [...new Set(
                historicos.map(h => new Date(h.dataFim).toLocaleDateString('pt-BR'))
            )];
            const hoje = new Date();
            const ontem = new Date(hoje);
            ontem.setDate(hoje.getDate() - 1);
            const treinouHoje = diasTreinados.includes(hoje.toLocaleDateString('pt-BR'));
            const treinouOntem = diasTreinados.includes(ontem.toLocaleDateString('pt-BR'));
            let streakAtual = 0;
            if (treinouHoje || treinouOntem) {
                const diaInicio = treinouHoje ? hoje : ontem;
                for (let i = 0; i < diasTreinados.length; i++) {
                    const diaEsperado = new Date(diaInicio);
                    diaEsperado.setDate(diaInicio.getDate() - i);
                    if (diasTreinados.includes(diaEsperado.toLocaleDateString('pt-BR'))) {
                        streakAtual++;
                    } else break;
                }
            }

            // Treinos longos (acima de 30min)
            const treinosLongos = historicos.filter(h => h.duracaoMinutos >= 30).length;

            // Semanas de desafios completas
            const semanasCompletas = desafios.filter(d => d.concluido).length;

            // Recordes — conta exercícios únicos com peso crescente
            const recordesQuebrados = new Set();
            const pesosPorExercicio = {};
            historicos
                .sort((a, b) => new Date(a.dataFim) - new Date(b.dataFim))
                .forEach(h => {
                    h.exerciciosRealizados.forEach(ex => {
                        if (!ex.peso) return;
                        if (!pesosPorExercicio[ex.nome]) {
                            pesosPorExercicio[ex.nome] = ex.peso;
                        } else if (ex.peso > pesosPorExercicio[ex.nome]) {
                            pesosPorExercicio[ex.nome] = ex.peso;
                            recordesQuebrados.add(`${ex.nome}_${ex.peso}`);
                        }
                    });
                });

            const metricas = {
                streak: streakAtual,
                total_treinos: totalTreinos,
                treinos_longos: treinosLongos,
                semanas_desafios: semanasCompletas,
                recordes: recordesQuebrados.size,
            };

            // Calcula nível de cada badge
            const resultado = {};
            for (const [id, badge] of Object.entries(BADGES_CONQUISTA)) {
                const valor = metricas[badge.tipo] ?? 0;
                let nivel = null;
                if (valor >= badge.metas.ouro) nivel = 'ouro';
                else if (valor >= badge.metas.prata) nivel = 'prata';
                else if (valor >= badge.metas.bronze) nivel = 'bronze';

                resultado[id] = {
                    ...badge,
                    valor,
                    nivel,
                    proximaMeta: nivel === 'ouro' ? null :
                        nivel === 'prata' ? badge.metas.ouro :
                            nivel === 'bronze' ? badge.metas.prata :
                                badge.metas.bronze,
                };
            }

            res.status(200).json(resultado);
        } catch (error) {
            console.error('ERRO:', error);
            res.status(500).json({ message: error.message });
        }
    }

    static async buscarBadgesGrupo(req, res) {
        try {
            const usuarioId = req.usuario._id;
            const historicos = await historico
                .find({ usuario: usuarioId })
                .sort({ dataFim: 1 });

            const resultado = {};

            for (const grupo of GRUPOS_MUSCULARES) {
                // Filtra treinos válidos para o grupo
                // Regras anti-burla:
                // - Mínimo 20 minutos
                // - Mínimo 3 exercícios do grupo
                // - Máximo 1 treino por grupo por dia
                // - Dias distribuídos em semanas diferentes

                const diasContados = new Set();
                const semanasContadas = new Set();
                let recordesNoGrupo = 0;
                let treinosValidos = 0;
                const pesosPorExercicio = {};

                for (const h of historicos) {
                    console.log('Histórico:', {
                        duracao: h.duracaoMinutos,
                        exercicios: h.exerciciosRealizados.map(ex => ({
                            nome: ex.nome,
                            grupo: ex.grupoMuscular
                        }))
                    });
                }

                for (const h of historicos) {
                    if (h.duracaoMinutos < 20) continue;

                    const exerciciosDoGrupo = h.exerciciosRealizados.filter(
                        ex => ex.grupoMuscular === grupo
                    );
                    if (exerciciosDoGrupo.length < 3) continue;

                    const dataStr = new Date(h.dataFim).toLocaleDateString('pt-BR');
                    if (diasContados.has(dataStr)) continue;

                    diasContados.add(dataStr);
                    const semana = getSemanaDoAno(new Date(h.dataFim));
                    semanasContadas.add(semana);
                    treinosValidos++;

                    // Conta recordes no grupo
                    for (const ex of exerciciosDoGrupo) {
                        if (!ex.peso) continue;
                        if (!pesosPorExercicio[ex.nome]) {
                            pesosPorExercicio[ex.nome] = ex.peso;
                        } else if (ex.peso > pesosPorExercicio[ex.nome]) {
                            pesosPorExercicio[ex.nome] = ex.peso;
                            recordesNoGrupo++;
                        }
                    }
                }

                // Define nível
                let nivel = null;
                let proximaMeta = 10;

                if (treinosValidos >= 10) {
                    nivel = 'bronze';
                    proximaMeta = 25;
                }
                if (treinosValidos >= 25 && recordesNoGrupo >= 1) {
                    nivel = 'prata';
                    proximaMeta = 50;
                }
                if (treinosValidos >= 50 && recordesNoGrupo >= 3 && semanasContadas.size >= 8) {
                    nivel = 'ouro';
                    proximaMeta = 100;
                }
                if (treinosValidos >= 100 && recordesNoGrupo >= 10 && semanasContadas.size >= 24) {
                    nivel = 'elite';
                    proximaMeta = null;
                }

                resultado[grupo] = {
                    grupo,
                    emoji: getEmojiGrupo(grupo),
                    treinosValidos,
                    recordesNoGrupo,
                    semanasUnicas: semanasContadas.size,
                    nivel,
                    proximaMeta,
                    metas: { bronze: 10, prata: 25, ouro: 50, elite: 100 },
                };
            }

            res.status(200).json(resultado);
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
            // Conta 1 treino por dia
            const diasUnicos = [...new Set(
                treinosSemana.map(t => new Date(t.dataFim).toLocaleDateString('pt-BR'))
            )];
            progresso = diasUnicos.length;
        }

        if (desafio.tipo === 'dias_seguidos') {
            progresso = calcularDiasSeguidos(treinosSemana);
        }

        if (desafio.tipo === 'duracao') {
            // Maior treino único da semana
            progresso = treinosSemana.reduce((max, t) =>
                t.duracaoMinutos > max ? t.duracaoMinutos : max, 0);
        }

        const novoProgresso = Math.min(progresso, desafio.meta);

        // ← Salva sempre que o progresso mudar, não só quando concluir
        if (novoProgresso !== desafio.progresso) {
            desafio.progresso = novoProgresso;
            atualizado = true;
        }

        if (progresso >= desafio.meta && !desafio.concluido) {
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
        console.log('Desafio atualizado!');
    }
}

function getInicioSemana() {
    const hoje = new Date();
    const dia = hoje.getDay();
    const diff = dia === 0 ? -6 : 1 - dia;
    const inicio = new Date(hoje);
    inicio.setDate(hoje.getDate() + diff);
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

    // Extrai dias únicos ordenados
    const dias = [...new Set(treinos.map(t =>
        new Date(t.dataFim).toLocaleDateString('pt-BR')
    ))].sort((a, b) => {
        const dA = new Date(a.split('/').reverse().join('-'));
        const dB = new Date(b.split('/').reverse().join('-'));
        return dA - dB;
    });

    if (dias.length === 0) return 0;

    // Conta sequência máxima de dias consecutivos
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

function getSemanaDoAno(data) {
    const inicio = new Date(data.getFullYear(), 0, 1);
    const semana = Math.ceil((((data - inicio) / 86400000) + inicio.getDay() + 1) / 7);
    return `${data.getFullYear()}-W${semana}`;
}

function getEmojiGrupo(grupo) {
    const emojis = {
        'Peito': '💪', 'Costas': '🔙', 'Pernas': '🦵',
        'Biceps': '💪', 'Triceps': '⚡', 'Ombros': '🏋️', 'Abdominais': '🔥'
    };
    return emojis[grupo] ?? '🏅';
}

export default DesafioController;