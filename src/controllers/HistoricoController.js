import historico from "../models/Historico.js";

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
                .sort({ dataFim: -1 }) // mais recente primeiro
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

            // Extrai datas únicas
            const diasTreinados = [...new Set(
                registros.map(r => new Date(r.dataFim).toLocaleDateString('pt-BR'))
            )];

            const hoje = new Date();
            const ontem = new Date(hoje);
            ontem.setDate(hoje.getDate() - 1);

            const treinouHoje = diasTreinados.includes(hoje.toLocaleDateString('pt-BR'));
            const treinouOntem = diasTreinados.includes(ontem.toLocaleDateString('pt-BR'));

            // Se não treinou nem hoje nem ontem, streak zerou
            if (!treinouHoje && !treinouOntem) {
                return res.status(200).json({ streak: 0, recordeStreak: calcularRecorde(diasTreinados) });
            }

            // Começa a contar a partir de hoje ou ontem
            const diaInicio = treinouHoje ? hoje : ontem;
            let streak = 0;

            for (let i = 0; i < diasTreinados.length; i++) {
                const diaEsperado = new Date(diaInicio);
                diaEsperado.setDate(diaInicio.getDate() - i);
                const diaEsperadoStr = diaEsperado.toLocaleDateString('pt-BR');

                if (diasTreinados.includes(diaEsperadoStr)) {
                    streak++;
                } else {
                    break;
                }
            }

            res.status(200).json({ streak, recordeStreak: calcularRecorde(diasTreinados) });
        } catch (error) {
            console.error('ERRO:', error);
            res.status(500).json({ message: error.message });
        }
    }

    static async buscarRecordes(req, res) {
        try {
            const historicos = await historico.find({ usuario: req.usuario._id })
                .sort({ dataFim: -1 })
                .exec();

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