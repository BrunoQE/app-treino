import Programa from '../models/Programa.js';
import Treino from '../models/Treino.js';

// Catálogo de programas prontos
const CATALOGO = [
    {
        id: 'shape_praia',
        nome: 'Shape de Praia',
        descricao: 'Foco em peito, ombros e braços para um shape definido',
        emoji: '🏖️',
        treinos: [
            {
                nome: 'Peito — Shape de Praia',
                diaSugerido: 'Segunda',
                exercicios: [
                    { nome: 'Supino reto com barra', serie: 4, repeticoes: '12', tempoDescanso: 60 },
                    { nome: 'Supino inclinado com halteres', serie: 3, repeticoes: '12', tempoDescanso: 60 },
                    { nome: 'Crucifixo com halteres', serie: 3, repeticoes: '15', tempoDescanso: 45 },
                    { nome: 'Crossover na polia', serie: 3, repeticoes: '15', tempoDescanso: 45 },
                ],
            },
            {
                nome: 'Ombros — Shape de Praia',
                diaSugerido: 'Quarta',
                exercicios: [
                    { nome: 'Desenvolvimento com halteres', serie: 4, repeticoes: '12', tempoDescanso: 60 },
                    { nome: 'Elevação lateral com halteres', serie: 3, repeticoes: '15', tempoDescanso: 45 },
                    { nome: 'Elevação frontal com halteres', serie: 3, repeticoes: '12', tempoDescanso: 45 },
                ],
            },
            {
                nome: 'Braços — Shape de Praia',
                diaSugerido: 'Sexta',
                exercicios: [
                    { nome: 'Rosca direta com barra', serie: 4, repeticoes: '12', tempoDescanso: 60 },
                    { nome: 'Rosca alternada com halteres', serie: 3, repeticoes: '12', tempoDescanso: 45 },
                    { nome: 'Tríceps testa com barra W', serie: 4, repeticoes: '12', tempoDescanso: 60 },
                    { nome: 'Tríceps corda na polia', serie: 3, repeticoes: '15', tempoDescanso: 45 },
                ],
            },
        ],
    },
    {
        id: 'hipertrofia_total',
        nome: 'Hipertrofia Total',
        descricao: 'Programa completo para ganho de massa muscular',
        emoji: '💪',
        treinos: [
            {
                nome: 'Peito e Tríceps',
                diaSugerido: 'Segunda',
                exercicios: [
                    { nome: 'Supino reto com barra', serie: 4, repeticoes: '10', tempoDescanso: 90 },
                    { nome: 'Supino inclinado com barra', serie: 3, repeticoes: '10', tempoDescanso: 90 },
                    { nome: 'Tríceps testa com barra W', serie: 4, repeticoes: '12', tempoDescanso: 60 },
                    { nome: 'Tríceps corda na polia', serie: 3, repeticoes: '12', tempoDescanso: 60 },
                ],
            },
            {
                nome: 'Costas e Bíceps',
                diaSugerido: 'Terça',
                exercicios: [
                    { nome: 'Puxada frontal na polia', serie: 4, repeticoes: '10', tempoDescanso: 90 },
                    { nome: 'Remada curvada com barra', serie: 4, repeticoes: '10', tempoDescanso: 90 },
                    { nome: 'Rosca direta com barra', serie: 4, repeticoes: '12', tempoDescanso: 60 },
                    { nome: 'Rosca martelo com halteres', serie: 3, repeticoes: '12', tempoDescanso: 60 },
                ],
            },
            {
                nome: 'Pernas',
                diaSugerido: 'Quinta',
                exercicios: [
                    { nome: 'Agachamento livre com barra', serie: 4, repeticoes: '10', tempoDescanso: 120 },
                    { nome: 'Leg press 45°', serie: 4, repeticoes: '12', tempoDescanso: 90 },
                    { nome: 'Cadeira extensora', serie: 3, repeticoes: '15', tempoDescanso: 60 },
                    { nome: 'Mesa flexora', serie: 3, repeticoes: '15', tempoDescanso: 60 },
                ],
            },
            {
                nome: 'Ombros e Abdômen',
                diaSugerido: 'Sexta',
                exercicios: [
                    { nome: 'Desenvolvimento com halteres', serie: 4, repeticoes: '12', tempoDescanso: 60 },
                    { nome: 'Elevação lateral com halteres', serie: 3, repeticoes: '15', tempoDescanso: 45 },
                    { nome: 'Abdominal supra', serie: 4, repeticoes: '20', tempoDescanso: 45 },
                    { nome: 'Prancha abdominal', serie: 3, repeticoes: '40s', tempoDescanso: 45 },
                ],
            },
        ],
    },
    {
        id: 'treino_rapido',
        nome: 'Treino Rápido',
        descricao: '3 treinos de 30 minutos para quem tem pouco tempo',
        emoji: '⚡',
        treinos: [
            {
                nome: 'Full Body A',
                diaSugerido: 'Segunda',
                exercicios: [
                    { nome: 'Agachamento livre com barra', serie: 3, repeticoes: '12', tempoDescanso: 60 },
                    { nome: 'Supino reto com barra', serie: 3, repeticoes: '12', tempoDescanso: 60 },
                    { nome: 'Remada curvada com barra', serie: 3, repeticoes: '12', tempoDescanso: 60 },
                ],
            },
            {
                nome: 'Full Body B',
                diaSugerido: 'Quarta',
                exercicios: [
                    { nome: 'Leg press 45°', serie: 3, repeticoes: '12', tempoDescanso: 60 },
                    { nome: 'Desenvolvimento com halteres', serie: 3, repeticoes: '12', tempoDescanso: 60 },
                    { nome: 'Rosca direta com barra', serie: 3, repeticoes: '12', tempoDescanso: 60 },
                ],
            },
            {
                nome: 'Full Body C',
                diaSugerido: 'Sexta',
                exercicios: [
                    { nome: 'Agachamento frontal', serie: 3, repeticoes: '12', tempoDescanso: 60 },
                    { nome: 'Supino inclinado com halteres', serie: 3, repeticoes: '12', tempoDescanso: 60 },
                    { nome: 'Puxada frontal na polia', serie: 3, repeticoes: '12', tempoDescanso: 60 },
                ],
            },
        ],
    },
    {
        id: 'abdomen_trincado',
        nome: 'Abdômen Trincado',
        descricao: 'Foco total no core para um abdômen definido',
        emoji: '🔥',
        treinos: [
            {
                nome: 'Core Intenso A',
                diaSugerido: 'Segunda',
                exercicios: [
                    { nome: 'Abdominal supra', serie: 4, repeticoes: '25', tempoDescanso: 45 },
                    { nome: 'Abdominal infra', serie: 4, repeticoes: '20', tempoDescanso: 45 },
                    { nome: 'Prancha abdominal', serie: 3, repeticoes: '45s', tempoDescanso: 45 },
                    { nome: 'Oblíquo com anilha', serie: 3, repeticoes: '20', tempoDescanso: 45 },
                ],
            },
            {
                nome: 'Core Intenso B',
                diaSugerido: 'Quinta',
                exercicios: [
                    { nome: 'Abdominal no cabo', serie: 4, repeticoes: '15', tempoDescanso: 45 },
                    { nome: 'Abdominal bicicleta', serie: 3, repeticoes: '30', tempoDescanso: 45 },
                    { nome: 'Prancha lateral', serie: 3, repeticoes: '30s', tempoDescanso: 45 },
                    { nome: 'Elevação de pernas', serie: 4, repeticoes: '15', tempoDescanso: 45 },
                ],
            },
        ],
    },
];

class ProgramaController {

    // GET /programas — lista programas do usuário
    static async listar(req, res) {
        try {
            const programas = await Programa.find({ usuario: req.usuario._id })
                .sort({ createdAt: -1 });

            // Conta treinos de cada programa
            const resultado = await Promise.all(programas.map(async (p) => {
                const totalTreinos = await Treino.countDocuments({ 
                    usuario: req.usuario._id, 
                    programa: p._id 
                });
                return { ...p.toObject(), totalTreinos };
            }));

            res.status(200).json(resultado);
        } catch (error) {
            console.error('ERRO:', error);
            res.status(500).json({ message: error.message });
        }
    }

    // POST /programas — cria novo programa
    static async criar(req, res) {
        try {
            const { nome, descricao, emoji } = req.body;
            if (!nome?.trim()) {
                return res.status(400).json({ message: 'Informe o nome do programa.' });
            }
            const programa = await Programa.create({
                nome: nome.trim(),
                descricao: descricao?.trim() ?? '',
                emoji: emoji ?? '💪',
                usuario: req.usuario._id,
            });
            res.status(201).json(programa);
        } catch (error) {
            console.error('ERRO:', error);
            res.status(500).json({ message: error.message });
        }
    }

    // PUT /programas/:id — edita programa
    static async editar(req, res) {
        try {
            const { nome, descricao, emoji } = req.body;
            const programa = await Programa.findOneAndUpdate(
                { _id: req.params.id, usuario: req.usuario._id },
                { nome: nome?.trim(), descricao: descricao?.trim(), emoji },
                { new: true }
            );
            if (!programa) return res.status(404).json({ message: 'Programa não encontrado.' });
            res.status(200).json(programa);
        } catch (error) {
            console.error('ERRO:', error);
            res.status(500).json({ message: error.message });
        }
    }

    // DELETE /programas/:id — deleta programa e seus treinos
    static async deletar(req, res) {
        try {
            const programa = await Programa.findOneAndDelete({ 
                _id: req.params.id, 
                usuario: req.usuario._id 
            });
            if (!programa) return res.status(404).json({ message: 'Programa não encontrado.' });
            
            // Deleta todos os treinos do programa
            await Treino.deleteMany({ 
                usuario: req.usuario._id, 
                programa: req.params.id 
            });
            
            res.status(200).json({ message: 'Programa excluído com sucesso.' });
        } catch (error) {
            console.error('ERRO:', error);
            res.status(500).json({ message: error.message });
        }
    }

    // GET /programas/catalogo — lista programas do catálogo
    static async listarCatalogo(req, res) {
        try {
            // Busca programas já adicionados pelo usuário
            const jaAdicionados = await Programa.find({ 
                usuario: req.usuario._id,
                doCatalogo: true 
            }).select('catalogoId');
            
            const idsAdicionados = jaAdicionados.map(p => p.catalogoId);

            const resultado = CATALOGO.map(p => ({
                ...p,
                jaAdicionado: idsAdicionados.includes(p.id),
                totalTreinos: p.treinos.length,
            }));

            res.status(200).json(resultado);
        } catch (error) {
            console.error('ERRO:', error);
            res.status(500).json({ message: error.message });
        }
    }

    // POST /programas/catalogo/:id/adicionar — copia programa do catálogo
    static async adicionarDoCatalogo(req, res) {
        try {
            const { id } = req.params;
            const programaCatalogo = CATALOGO.find(p => p.id === id);
            
            if (!programaCatalogo) {
                return res.status(404).json({ message: 'Programa não encontrado no catálogo.' });
            }

            // Verifica se já adicionou
            const jaExiste = await Programa.findOne({ 
                usuario: req.usuario._id, 
                catalogoId: id 
            });
            if (jaExiste) {
                return res.status(400).json({ message: 'Você já adicionou este programa.' });
            }

            // Cria o programa
            const programa = await Programa.create({
                nome: programaCatalogo.nome,
                descricao: programaCatalogo.descricao,
                emoji: programaCatalogo.emoji,
                usuario: req.usuario._id,
                doCatalogo: true,
                catalogoId: id,
            });

            // Busca exercícios do catálogo por nome
            const Exercicios = (await import('../models/Exercicios.js')).default;

            // Cria os treinos do programa
            for (const treinoCat of programaCatalogo.treinos) {
                const exerciciosComIds = await Promise.all(
                    treinoCat.exercicios.map(async (ex, ordem) => {
                        const exercicioEncontrado = await Exercicios.findOne({ 
                            nome: { $regex: new RegExp(ex.nome, 'i') }
                        });
                        if (!exercicioEncontrado) return null;
                        return {
                            exercicio: exercicioEncontrado._id,
                            serie: ex.serie,
                            repeticoes: ex.repeticoes,
                            tempoDescanso: ex.tempoDescanso,
                            ordem,
                        };
                    })
                );

                await Treino.create({
                    nome: treinoCat.nome,
                    diaSugerido: treinoCat.diaSugerido,
                    exercicios: exerciciosComIds.filter(Boolean),
                    usuario: req.usuario._id,
                    programa: programa._id,
                });
            }

            res.status(201).json({ 
                message: `Programa "${programaCatalogo.nome}" adicionado com sucesso!`,
                programa,
            });
        } catch (error) {
            console.error('ERRO:', error);
            res.status(500).json({ message: error.message });
        }
    }

    // POST /programas/migrar — migra treinos sem programa para "Meus Treinos"
    static async migrar(req, res) {
        try {
            // Verifica se já tem programa padrão
            let programaPadrao = await Programa.findOne({ 
                usuario: req.usuario._id,
                nome: 'Meus Treinos'
            });

            // Busca treinos sem programa
            const treinosSemPrograma = await Treino.find({ 
                usuario: req.usuario._id,
                programa: null
            });

            if (treinosSemPrograma.length === 0) {
                return res.status(200).json({ message: 'Nenhum treino para migrar.' });
            }

            // Cria programa padrão se não existir
            if (!programaPadrao) {
                programaPadrao = await Programa.create({
                    nome: 'Meus Treinos',
                    descricao: 'Seus treinos personalizados',
                    emoji: '💪',
                    usuario: req.usuario._id,
                });
            }

            // Migra treinos
            await Treino.updateMany(
                { usuario: req.usuario._id, programa: null },
                { programa: programaPadrao._id }
            );

            res.status(200).json({ 
                message: `${treinosSemPrograma.length} treino(s) migrado(s) para "${programaPadrao.nome}".`,
                programa: programaPadrao,
            });
        } catch (error) {
            console.error('ERRO:', error);
            res.status(500).json({ message: error.message });
        }
    }
}

export default ProgramaController;