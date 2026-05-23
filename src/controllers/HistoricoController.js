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
                        semana: `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}`,
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