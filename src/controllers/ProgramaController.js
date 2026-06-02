import Programa from '../models/Programa.js';
import Treino from '../models/Treino.js';

const CATALOGO = [
    {
        id: 'shape_praia',
        nome: 'Shape de Praia',
        descricao: 'Foco em peito, ombros e braços para um shape definido',
        emoji: '🏖️',
        cor: '#FF6B35',
        nivel: 'Intermediário',
        objetivo: 'Definição',
        diasPorSemana: 3,
        treinos: [
            {
                nome: 'Peito — Shape de Praia',
                diaSugerido: 'Segunda',
                exercicios: [
                    { nome: 'Supino reto com barra', serie: 4, repeticoes: '8-12', tempoDescanso: 90 },
                    { nome: 'Supino inclinado com halteres', serie: 3, repeticoes: '10-12', tempoDescanso: 75 },
                    { nome: 'Crucifixo com halteres', serie: 3, repeticoes: '12-15', tempoDescanso: 60 },
                    { nome: 'Cross-over na polia', serie: 3, repeticoes: '12-15', tempoDescanso: 60 },
                    { nome: 'Flexão declinada', serie: 3, repeticoes: 'até falhar', tempoDescanso: 60 },
                ],
            },
            {
                nome: 'Ombros — Shape de Praia',
                diaSugerido: 'Quarta',
                exercicios: [
                    { nome: 'Desenvolvimento sentado com barra', serie: 4, repeticoes: '8-10', tempoDescanso: 90 },
                    { nome: 'Elevação lateral com halteres', serie: 4, repeticoes: '12-15', tempoDescanso: 60 },
                    { nome: 'Elevação frontal alternada sentada com halteres', serie: 3, repeticoes: '12', tempoDescanso: 60 },
                    { nome: 'Remada alta com barra', serie: 3, repeticoes: '10-12', tempoDescanso: 75 },
                    { nome: 'Encolhimento com halteres', serie: 3, repeticoes: '15-20', tempoDescanso: 45 },
                ],
            },
            {
                nome: 'Braços — Shape de Praia',
                diaSugerido: 'Sexta',
                exercicios: [
                    { nome: 'Rosca direta com barra', serie: 4, repeticoes: '10-12', tempoDescanso: 75 },
                    { nome: 'Rosca bíceps alternada com halteres', serie: 3, repeticoes: '10-12', tempoDescanso: 60 },
                    { nome: 'Rosca concentrada com halteres', serie: 3, repeticoes: '12-15', tempoDescanso: 45 },
                    { nome: 'Tríceps corda na polia', serie: 4, repeticoes: '12-15', tempoDescanso: 60 },
                    { nome: 'Tríceps testa com barra', serie: 3, repeticoes: '10-12', tempoDescanso: 75 },
                    { nome: 'Mergulho entre bancos', serie: 3, repeticoes: 'até falhar', tempoDescanso: 60 },
                ],
            },
        ],
    },
    {
        id: 'hipertrofia_total',
        nome: 'Hipertrofia Total',
        descricao: 'Programa completo para ganho de massa muscular',
        emoji: '💪',
        cor: '#F4A261',
        nivel: 'Intermediário',
        objetivo: 'Hipertrofia',
        diasPorSemana: 4,
        treinos: [
            {
                nome: 'Peito e Tríceps',
                diaSugerido: 'Segunda',
                exercicios: [
                    { nome: 'Supino reto com barra', serie: 4, repeticoes: '6-10', tempoDescanso: 120 },
                    { nome: 'Supino inclinado com halteres', serie: 3, repeticoes: '8-12', tempoDescanso: 90 },
                    { nome: 'Cross-over na polia', serie: 3, repeticoes: '12-15', tempoDescanso: 60 },
                    { nome: 'Tríceps corda na polia', serie: 4, repeticoes: '12-15', tempoDescanso: 60 },
                    { nome: 'Tríceps francês sentado com barra W', serie: 3, repeticoes: '10-12', tempoDescanso: 75 },
                ],
            },
            {
                nome: 'Costas e Bíceps',
                diaSugerido: 'Terça',
                exercicios: [
                    { nome: 'Barra fixa', serie: 4, repeticoes: '6-10', tempoDescanso: 120 },
                    { nome: 'Remada curvada com barra', serie: 4, repeticoes: '8-10', tempoDescanso: 90 },
                    { nome: 'Puxada alta na polia', serie: 3, repeticoes: '10-12', tempoDescanso: 75 },
                    { nome: 'Remada curvada unilateral com halteres', serie: 3, repeticoes: '10-12', tempoDescanso: 60 },
                    { nome: 'Rosca direta com barra', serie: 3, repeticoes: '10-12', tempoDescanso: 60 },
                    { nome: 'Rosca Scott com halteres', serie: 3, repeticoes: '12-15', tempoDescanso: 45 },
                ],
            },
            {
                nome: 'Pernas',
                diaSugerido: 'Quinta',
                exercicios: [
                    { nome: 'Agachamento livre com barra', serie: 4, repeticoes: '8-10', tempoDescanso: 120 },
                    { nome: 'Leg press com pés altos', serie: 4, repeticoes: '10-12', tempoDescanso: 90 },
                    { nome: 'Cadeira extensora na máquina', serie: 3, repeticoes: '12-15', tempoDescanso: 60 },
                    { nome: 'Stiff com barra', serie: 4, repeticoes: '10-12', tempoDescanso: 90 },
                    { nome: 'Cadeira flexora na máquina', serie: 3, repeticoes: '12-15', tempoDescanso: 60 },
                    { nome: 'Panturrilha em pé na máquina', serie: 4, repeticoes: '15-20', tempoDescanso: 45 },
                ],
            },
            {
                nome: 'Ombros e Abdômen',
                diaSugerido: 'Sexta',
                exercicios: [
                    { nome: 'Desenvolvimento Arnold com halteres', serie: 4, repeticoes: '8-12', tempoDescanso: 90 },
                    { nome: 'Elevação lateral com halteres', serie: 4, repeticoes: '12-15', tempoDescanso: 60 },
                    { nome: 'Crucifixo invertido (voador inverso)', serie: 3, repeticoes: '12-15', tempoDescanso: 60 },
                    { nome: 'Abdominal ajoelhado na polia', serie: 3, repeticoes: '15-20', tempoDescanso: 45 },
                    { nome: 'Prancha isométrica', serie: 3, repeticoes: '45 seg', tempoDescanso: 45 },
                    { nome: 'Elevação de pernas suspenso', serie: 3, repeticoes: '15-20', tempoDescanso: 45 },
                ],
            },
        ],
    },
    {
        id: 'gluteos_foco',
        nome: 'Glúteos em Foco',
        descricao: 'Programa feminino para glúteos empinados e pernas torneadas',
        emoji: '🍑',
        cor: '#E76F51',
        nivel: 'Iniciante',
        objetivo: 'Hipertrofia',
        diasPorSemana: 3,
        treinos: [
            {
                nome: 'Glúteos e Quadríceps',
                diaSugerido: 'Segunda',
                exercicios: [
                    { nome: 'Agachamento búlgaro', serie: 4, repeticoes: '12-15', tempoDescanso: 75 },
                    { nome: 'Leg press com pés altos', serie: 4, repeticoes: '12-15', tempoDescanso: 75 },
                    { nome: 'Agachamento búlgaro (cadeira)', serie: 3, repeticoes: '10-12 por perna', tempoDescanso: 75 },
                    { nome: 'Cadeira extensora na máquina', serie: 3, repeticoes: '15-20', tempoDescanso: 45 },
                    { nome: 'Passada com halteres', serie: 3, repeticoes: '12 por perna', tempoDescanso: 60 },
                ],
            },
            {
                nome: 'Glúteos e Posteriores',
                diaSugerido: 'Quarta',
                exercicios: [
                    { nome: 'Ponte glútea com barra', serie: 4, repeticoes: '12-15', tempoDescanso: 75 },
                    { nome: 'Stiff com halteres', serie: 4, repeticoes: '12-15', tempoDescanso: 75 },
                    { nome: 'Kickback na polia baixa', serie: 3, repeticoes: '15 por perna', tempoDescanso: 45 },
                    { nome: 'Cadeira flexora na máquina', serie: 3, repeticoes: '12-15', tempoDescanso: 60 },
                    { nome: 'Adutor na máquina', serie: 4, repeticoes: '15-20', tempoDescanso: 45 },
                ],
            },
            {
                nome: 'Glúteos e Panturrilhas',
                diaSugerido: 'Sexta',
                exercicios: [
                    { nome: 'Agachamento livre com barra', serie: 4, repeticoes: '10-12', tempoDescanso: 90 },
                    { nome: 'Ponte glútea com barra', serie: 3, repeticoes: '12 por perna', tempoDescanso: 60 },
                    { nome: 'Adutor na máquina', serie: 3, repeticoes: '15-20', tempoDescanso: 45 },
                    { nome: 'Panturrilha em pé na máquina', serie: 4, repeticoes: '15-20', tempoDescanso: 45 },
                    { nome: 'Elevação de panturrilha sentado na máquina', serie: 3, repeticoes: '15-20', tempoDescanso: 45 },
                ],
            },
        ],
    },
    {
        id: 'forca_maxima',
        nome: 'Força Máxima',
        descricao: 'Levantamentos base para força bruta e potência',
        emoji: '🏋️',
        cor: '#264653',
        nivel: 'Avançado',
        objetivo: 'Força',
        diasPorSemana: 4,
        treinos: [
            {
                nome: 'Dia do Agachamento',
                diaSugerido: 'Segunda',
                exercicios: [
                    { nome: 'Agachamento livre com barra', serie: 5, repeticoes: '3-5', tempoDescanso: 180 },
                    { nome: 'Agachamento frontal com barra', serie: 3, repeticoes: '5-6', tempoDescanso: 150 },
                    { nome: 'Leg press com pés altos', serie: 3, repeticoes: '8-10', tempoDescanso: 120 },
                    { nome: 'Cadeira extensora na máquina', serie: 3, repeticoes: '10-12', tempoDescanso: 90 },
                    { nome: 'Good morning com barra', serie: 3, repeticoes: '8-10', tempoDescanso: 90 },
                ],
            },
            {
                nome: 'Dia do Supino',
                diaSugerido: 'Terça',
                exercicios: [
                    { nome: 'Supino reto com barra', serie: 5, repeticoes: '3-5', tempoDescanso: 180 },
                    { nome: 'Supino inclinado com barra', serie: 3, repeticoes: '5-6', tempoDescanso: 150 },
                    { nome: 'Desenvolvimento militar em pé com barra', serie: 3, repeticoes: '5-8', tempoDescanso: 120 },
                    { nome: 'Paralelas com peso', serie: 3, repeticoes: '6-8', tempoDescanso: 120 },
                    { nome: 'Tríceps na polia com barra V', serie: 3, repeticoes: '10-12', tempoDescanso: 75 },
                ],
            },
            {
                nome: 'Dia do Levantamento Terra',
                diaSugerido: 'Quinta',
                exercicios: [
                    { nome: 'Levantamento terra com barra', serie: 5, repeticoes: '3-5', tempoDescanso: 180 },
                    { nome: 'Levantamento terra romeno com barra', serie: 3, repeticoes: '6-8', tempoDescanso: 150 },
                    { nome: 'Remada curvada com barra', serie: 4, repeticoes: '6-8', tempoDescanso: 120 },
                    { nome: 'Barra fixa com carga', serie: 3, repeticoes: '6-8', tempoDescanso: 120 },
                    { nome: 'Hiperextensão lombar', serie: 3, repeticoes: '10-12', tempoDescanso: 75 },
                ],
            },
            {
                nome: 'Acessórios e Core',
                diaSugerido: 'Sexta',
                exercicios: [
                    { nome: 'Rosca direta com barra W', serie: 4, repeticoes: '8-10', tempoDescanso: 75 },
                    { nome: 'Tríceps testa com barra W', serie: 4, repeticoes: '8-10', tempoDescanso: 75 },
                    { nome: 'Face pull na polia', serie: 3, repeticoes: '15-20', tempoDescanso: 45 },
                    { nome: 'Prancha com peso nas costas', serie: 3, repeticoes: '30-45 seg', tempoDescanso: 60 },
                    { nome: 'Abdominal roda', serie: 3, repeticoes: '10-15', tempoDescanso: 60 },
                ],
            },
        ],
    },
    {
        id: 'corpo_inteiro',
        nome: 'Corpo Inteiro',
        descricao: 'Treino full body 3x por semana para iniciantes',
        emoji: '⚡',
        cor: '#2A9D8F',
        nivel: 'Iniciante',
        objetivo: 'Condicionamento',
        diasPorSemana: 3,
        treinos: [
            {
                nome: 'Full Body A',
                diaSugerido: 'Segunda',
                exercicios: [
                    { nome: 'Agachamento com peso corporal', serie: 3, repeticoes: '10-12', tempoDescanso: 90 },
                    { nome: 'Supino reto com halteres', serie: 3, repeticoes: '10-12', tempoDescanso: 75 },
                    { nome: 'Puxada alta na polia', serie: 3, repeticoes: '10-12', tempoDescanso: 75 },
                    { nome: 'Desenvolvimento Arnold com halteres', serie: 3, repeticoes: '10-12', tempoDescanso: 75 },
                    { nome: 'Rosca bíceps em pé com halteres', serie: 2, repeticoes: '12-15', tempoDescanso: 60 },
                    { nome: 'Tríceps na polia', serie: 2, repeticoes: '12-15', tempoDescanso: 60 },
                ],
            },
            {
                nome: 'Full Body B',
                diaSugerido: 'Quarta',
                exercicios: [
                    { nome: 'Leg press com pés altos', serie: 3, repeticoes: '12-15', tempoDescanso: 90 },
                    { nome: 'Supino inclinado com halteres', serie: 3, repeticoes: '10-12', tempoDescanso: 75 },
                    { nome: 'Remada cavalinho', serie: 3, repeticoes: '10-12', tempoDescanso: 75 },
                    { nome: 'Elevação lateral com halteres', serie: 3, repeticoes: '12-15', tempoDescanso: 60 },
                    { nome: 'Rosca Scott com halteres', serie: 2, repeticoes: '12-15', tempoDescanso: 60 },
                    { nome: 'Tríceps francês em pé com halteres', serie: 2, repeticoes: '12-15', tempoDescanso: 60 },
                ],
            },
            {
                nome: 'Full Body C',
                diaSugerido: 'Sexta',
                exercicios: [
                    { nome: 'Stiff com halteres', serie: 3, repeticoes: '12-15', tempoDescanso: 90 },
                    { nome: 'Crucifixo com halteres', serie: 3, repeticoes: '12-15', tempoDescanso: 60 },
                    { nome: 'Barra fixa supinada', serie: 3, repeticoes: 'máx', tempoDescanso: 90 },
                    { nome: 'Desenvolvimento Arnold com halteres', serie: 3, repeticoes: '10-12', tempoDescanso: 75 },
                    { nome: 'Rosca martelo com halteres', serie: 2, repeticoes: '12-15', tempoDescanso: 60 },
                    { nome: 'Tríceps coice com haltere', serie: 2, repeticoes: '12-15', tempoDescanso: 60 },
                ],
            },
        ],
    },
    {
        id: 'queima_total',
        nome: 'Queima Total',
        descricao: 'Cardio + musculação para máximo gasto calórico',
        emoji: '🔥',
        cor: '#E9C46A',
        nivel: 'Iniciante',
        objetivo: 'Emagrecimento',
        diasPorSemana: 5,
        treinos: [
            {
                nome: 'Superior — Queima Total',
                diaSugerido: 'Segunda',
                exercicios: [
                    { nome: 'Flexão de braços', serie: 3, repeticoes: '15-20', tempoDescanso: 30 },
                    { nome: 'Remada curvada com halteres', serie: 3, repeticoes: '15', tempoDescanso: 30 },
                    { nome: 'Desenvolvimento Arnold com halteres', serie: 3, repeticoes: '15', tempoDescanso: 30 },
                    { nome: 'Supino reto com halteres', serie: 3, repeticoes: '12-15', tempoDescanso: 45 },
                    { nome: 'Burpee', serie: 3, repeticoes: '10', tempoDescanso: 60 },
                ],
            },
            {
                nome: 'Cardio HIIT',
                diaSugerido: 'Terça',
                exercicios: [
                    { nome: 'Sprint na esteira (30s corrida / 30s pausa)', serie: 10, repeticoes: '30 seg', tempoDescanso: 30, tipo: 'cardio', tempoTotal: 5 },
                    { nome: 'Pulo na caixa (box jump)', serie: 3, repeticoes: '10', tempoDescanso: 60 },
                    { nome: 'Corda (jumping rope)', serie: 3, repeticoes: '60 seg', tempoDescanso: 30, tipo: 'cardio', tempoTotal: 3 },
                    { nome: 'Mountain climber', serie: 3, repeticoes: '30 seg', tempoDescanso: 30 },
                ],
            },
            {
                nome: 'Inferior — Queima Total',
                diaSugerido: 'Quarta',
                exercicios: [
                    { nome: 'Agachamento com salto', serie: 3, repeticoes: '12-15', tempoDescanso: 60 },
                    { nome: 'Passada alternada com halteres', serie: 3, repeticoes: '12 por perna', tempoDescanso: 60 },
                    { nome: 'Leg press com pés altos', serie: 3, repeticoes: '15-20', tempoDescanso: 60 },
                    { nome: 'Elevação de quadril', serie: 3, repeticoes: '15-20', tempoDescanso: 45 },
                    { nome: 'Step up na caixa', serie: 3, repeticoes: '12 por perna', tempoDescanso: 45 },
                ],
            },
            {
                nome: 'Core e Cardio',
                diaSugerido: 'Quinta',
                exercicios: [
                    { nome: 'Abdominal supra 3/4', serie: 3, repeticoes: '20-25', tempoDescanso: 30 },
                    { nome: 'Abdominal infra', serie: 3, repeticoes: '15-20', tempoDescanso: 30 },
                    { nome: 'Prancha lateral variação 2', serie: 3, repeticoes: '30 seg por lado', tempoDescanso: 30, tipo: 'isometrico', tempoPorSerie: 30 },
                    { nome: 'Bicicleta abdominal', serie: 3, repeticoes: '30 seg', tempoDescanso: 30 },
                    { nome: 'Elíptico', serie: 1, repeticoes: '20 min', tempoDescanso: 0, tipo: 'cardio', tempoTotal: 20 },
                ],
            },
            {
                nome: 'Full Body Metabólico',
                diaSugerido: 'Sexta',
                exercicios: [
                    { nome: 'Agachamento com halteres', serie: 4, repeticoes: '15', tempoDescanso: 20 },
                    { nome: 'Flexão de braços', serie: 4, repeticoes: '15', tempoDescanso: 20 },
                    { nome: 'Remada curvada com halteres', serie: 4, repeticoes: '15', tempoDescanso: 20 },
                    { nome: 'Burpee', serie: 4, repeticoes: '10', tempoDescanso: 20 },
                    { nome: 'Kettlebell swing', serie: 3, repeticoes: '20', tempoDescanso: 60 },
                ],
            },
        ],
    },
    {
        id: 'atleta_completo',
        nome: 'Atleta Completo',
        descricao: 'Divisão ABCDE para máxima hipertrofia e definição',
        emoji: '🏆',
        cor: '#457B9D',
        nivel: 'Avançado',
        objetivo: 'Hipertrofia',
        diasPorSemana: 5,
        treinos: [
            {
                nome: 'Peito — Atleta Completo',
                diaSugerido: 'Segunda',
                exercicios: [
                    { nome: 'Supino reto com barra', serie: 5, repeticoes: '12/10/8/6/4', tempoDescanso: 90 },
                    { nome: 'Supino inclinado com halteres', serie: 4, repeticoes: '10-12', tempoDescanso: 75 },
                    { nome: 'Supino declinado com barra', serie: 3, repeticoes: '10-12', tempoDescanso: 75 },
                    { nome: 'Crucifixo inclinado com halteres', serie: 3, repeticoes: '12-15', tempoDescanso: 60 },
                    { nome: 'Cross-over na polia', serie: 3, repeticoes: '15-20', tempoDescanso: 45 },
                ],
            },
            {
                nome: 'Costas — Atleta Completo',
                diaSugerido: 'Terça',
                exercicios: [
                    { nome: 'Levantamento terra com barra', serie: 4, repeticoes: '6-8', tempoDescanso: 150 },
                    { nome: 'Barra fixa com carga', serie: 4, repeticoes: '6-10', tempoDescanso: 120 },
                    { nome: 'Remada curvada com barra', serie: 4, repeticoes: '8-10', tempoDescanso: 90 },
                    { nome: 'Puxada alta supinada na polia', serie: 3, repeticoes: '10-12', tempoDescanso: 75 },
                    { nome: 'Remada curvada unilateral com halteres', serie: 3, repeticoes: '10-12', tempoDescanso: 60 },
                ],
            },
            {
                nome: 'Pernas — Atleta Completo',
                diaSugerido: 'Quarta',
                exercicios: [
                    { nome: 'Agachamento livre com barra', serie: 5, repeticoes: '6-10', tempoDescanso: 120 },
                    { nome: 'Leg press com pés altos', serie: 4, repeticoes: '10-12', tempoDescanso: 90 },
                    { nome: 'Stiff com barra', serie: 4, repeticoes: '8-10', tempoDescanso: 90 },
                    { nome: 'Passada com halteres', serie: 3, repeticoes: '12 por perna', tempoDescanso: 75 },
                    { nome: 'Panturrilha em pé na máquina', serie: 5, repeticoes: '12-20', tempoDescanso: 45 },
                ],
            },
            {
                nome: 'Ombros — Atleta Completo',
                diaSugerido: 'Quinta',
                exercicios: [
                    { nome: 'Desenvolvimento militar em pé com barra', serie: 4, repeticoes: '6-10', tempoDescanso: 90 },
                    { nome: 'Elevação lateral com halteres', serie: 4, repeticoes: '10+10+10', tempoDescanso: 75 },
                    { nome: 'Desenvolvimento Arnold com halteres', serie: 3, repeticoes: '10-12', tempoDescanso: 75 },
                    { nome: 'Elevação frontal com barra', serie: 3, repeticoes: '10-12', tempoDescanso: 60 },
                    { nome: 'Crucifixo invertido (voador inverso)', serie: 3, repeticoes: '12-15', tempoDescanso: 60 },
                ],
            },
            {
                nome: 'Braços — Atleta Completo',
                diaSugerido: 'Sexta',
                exercicios: [
                    { nome: 'Rosca direta com barra', serie: 4, repeticoes: '21 reps', tempoDescanso: 90 },
                    { nome: 'Rosca inclinada com halteres', serie: 3, repeticoes: '10-12', tempoDescanso: 75 },
                    { nome: 'Rosca concentrada com halteres', serie: 3, repeticoes: '12-15', tempoDescanso: 45 },
                    { nome: 'Tríceps francês em pé com halteres', serie: 3, repeticoes: '10-12', tempoDescanso: 60 },
                    { nome: 'Rosca de punho no banco com halteres', serie: 3, repeticoes: '15-20', tempoDescanso: 30 },
                ],
            },
        ],
    },
    {
        id: 'treino_em_casa',
        nome: 'Treino em Casa',
        descricao: 'Sem equipamento, máximos resultados com peso corporal',
        emoji: '🏠',
        cor: '#6D6875',
        nivel: 'Iniciante',
        objetivo: 'Condicionamento',
        diasPorSemana: 4,
        treinos: [
            {
                nome: 'Superior — Em Casa',
                diaSugerido: 'Segunda',
                exercicios: [
                    { nome: 'Flexão de braços', serie: 4, repeticoes: '15-20', tempoDescanso: 60 },
                    { nome: 'Flexão declinada', serie: 3, repeticoes: '12-15', tempoDescanso: 60 },
                    { nome: 'Flexão diamante', serie: 3, repeticoes: '10-15', tempoDescanso: 60 },
                    { nome: 'Remada invertida', serie: 4, repeticoes: '10-15', tempoDescanso: 75 },
                    { nome: 'Pike push-up', serie: 3, repeticoes: '10-15', tempoDescanso: 60 },
                ],
            },
            {
                nome: 'Inferior — Em Casa',
                diaSugerido: 'Terça',
                exercicios: [
                    { nome: 'Agachamento com peso corporal', serie: 4, repeticoes: '20-25', tempoDescanso: 60 },
                    { nome: 'Agachamento búlgaro (cadeira)', serie: 3, repeticoes: '12-15 por perna', tempoDescanso: 75 },
                    { nome: 'Passada estacionária', serie: 3, repeticoes: '15 por perna', tempoDescanso: 60 },
                    { nome: 'Elevação de quadril', serie: 4, repeticoes: '20-25', tempoDescanso: 45 },
                    { nome: 'Panturrilha na escada', serie: 4, repeticoes: '20-25', tempoDescanso: 30 },
                ],
            },
            {
                nome: 'Core — Em Casa',
                diaSugerido: 'Quinta',
                exercicios: [
                    { nome: 'Abdominal supra 3/4', serie: 3, repeticoes: '25-30', tempoDescanso: 30 },
                    { nome: 'Prancha frontal', serie: 4, repeticoes: '45-60 seg', tempoDescanso: 30, tipo: 'isometrico', tempoPorSerie: 45 },
                    { nome: 'Prancha lateral variação 2', serie: 3, repeticoes: '30 seg por lado', tempoDescanso: 30, tipo: 'isometrico', tempoPorSerie: 30 },
                    { nome: 'Mountain climber', serie: 3, repeticoes: '30 seg', tempoDescanso: 30, tipo: 'isometrico', tempoPorSerie: 30 },
                    { nome: 'Superman (extensão lombar)', serie: 3, repeticoes: '15-20', tempoDescanso: 30 },
                ],
            },
            {
                nome: 'HIIT — Em Casa',
                diaSugerido: 'Sexta',
                exercicios: [
                    { nome: 'Jumping jack', serie: 3, repeticoes: '40 seg', tempoDescanso: 20 },
                    { nome: 'Burpee', serie: 3, repeticoes: '30 seg', tempoDescanso: 30 },
                    { nome: 'Agachamento com salto', serie: 3, repeticoes: '30 seg', tempoDescanso: 30 },
                    { nome: 'High knees (joelho alto)', serie: 3, repeticoes: '40 seg', tempoDescanso: 20 },
                    { nome: 'Flexão explosiva', serie: 3, repeticoes: '10-12', tempoDescanso: 45 },
                ],
            },
        ],
    },
    {
        id: 'corredor_forte',
        nome: 'Corredor Forte',
        descricao: 'Musculação complementar para quem corre ou pratica esportes',
        emoji: '🏃',
        cor: '#1D3557',
        nivel: 'Intermediário',
        objetivo: 'Condicionamento',
        diasPorSemana: 3,
        treinos: [
            {
                nome: 'Força para Corrida',
                diaSugerido: 'Segunda',
                exercicios: [
                    { nome: 'Agachamento pistol', serie: 3, repeticoes: '8-10 por perna', tempoDescanso: 90 },
                    { nome: 'Passada com halteres', serie: 3, repeticoes: '12 por perna', tempoDescanso: 75 },
                    { nome: 'Step up na caixa', serie: 3, repeticoes: '10 por perna', tempoDescanso: 75 },
                    { nome: 'Panturrilha na escada', serie: 4, repeticoes: '15-20', tempoDescanso: 45 },
                    { nome: 'Abdução de quadril sentado na máquina', serie: 3, repeticoes: '20', tempoDescanso: 30 },
                ],
            },
            {
                nome: 'Superior e Core',
                diaSugerido: 'Quarta',
                exercicios: [
                    { nome: 'Barra fixa supinada', serie: 4, repeticoes: '8-10', tempoDescanso: 90 },
                    { nome: 'Remada curvada com halteres', serie: 3, repeticoes: '10-12', tempoDescanso: 75 },
                    { nome: 'Desenvolvimento Arnold com halteres', serie: 3, repeticoes: '10-12', tempoDescanso: 75 },
                    { nome: 'Flexão de braços', serie: 3, repeticoes: '15-20', tempoDescanso: 60 },
                    { nome: 'Prancha com caminhada nos cotovelos', serie: 3, repeticoes: '20 passos', tempoDescanso: 45 },
                ],
            },
            {
                nome: 'Potência e Explosão',
                diaSugerido: 'Sexta',
                exercicios: [
                    { nome: 'Kettlebell swing', serie: 4, repeticoes: '15-20', tempoDescanso: 75 },
                    { nome: 'Box jump', serie: 3, repeticoes: '8-10', tempoDescanso: 90 },
                    { nome: 'Salto horizontal (broad jump)', serie: 3, repeticoes: '6-8', tempoDescanso: 75 },
                    { nome: 'Agachamento com salto', serie: 3, repeticoes: '10', tempoDescanso: 60 },
                    { nome: 'Burpee', serie: 3, repeticoes: '10', tempoDescanso: 60 },
                ],
            },
        ],
    },
];

class ProgramaController {

    static async listar(req, res) {
        try {
            const programas = await Programa.find({ usuario: req.usuario._id }).sort({ createdAt: -1 });
            const resultado = await Promise.all(programas.map(async (p) => {
                const totalTreinos = await Treino.countDocuments({ usuario: req.usuario._id, programa: p._id });
                return { ...p.toObject(), totalTreinos };
            }));
            res.status(200).json(resultado);
        } catch (error) {
            console.error('ERRO:', error);
            res.status(500).json({ message: error.message });
        }
    }

    static async criar(req, res) {
        try {
            const { nome, descricao, emoji } = req.body;
            if (!nome?.trim()) return res.status(400).json({ message: 'Informe o nome do programa.' });
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

    static async deletar(req, res) {
        try {
            const programa = await Programa.findOneAndDelete({ _id: req.params.id, usuario: req.usuario._id });
            if (!programa) return res.status(404).json({ message: 'Programa não encontrado.' });
            await Treino.deleteMany({ usuario: req.usuario._id, programa: req.params.id });
            res.status(200).json({ message: 'Programa excluído com sucesso.' });
        } catch (error) {
            console.error('ERRO:', error);
            res.status(500).json({ message: error.message });
        }
    }

    static async listarCatalogo(req, res) {
        try {
            const { nivel, objetivo } = req.query;
            const jaAdicionados = await Programa.find({ usuario: req.usuario._id, doCatalogo: true }).select('catalogoId bloqueado');
            const idsAdicionados = jaAdicionados.filter(p => !p.bloqueado).map(p => p.catalogoId);
            let catalogo = CATALOGO;
            if (nivel) catalogo = catalogo.filter(p => p.nivel === nivel);
            if (objetivo) catalogo = catalogo.filter(p => p.objetivo === objetivo);
            const resultado = catalogo.map(p => ({ ...p, jaAdicionado: idsAdicionados.includes(p.id), totalTreinos: p.treinos.length }));
            res.status(200).json(resultado);
        } catch (error) {
            console.error('ERRO:', error);
            res.status(500).json({ message: error.message });
        }
    }

    static async adicionarDoCatalogo(req, res) {
        try {
            const { id } = req.params;
            const programaCatalogo = CATALOGO.find(p => p.id === id);
            if (!programaCatalogo) return res.status(404).json({ message: 'Programa não encontrado no catálogo.' });

            // Verifica se já existe bloqueado
            const jaExisteBloqueado = await Programa.findOne({
                usuario: req.usuario._id,
                catalogoId: id,
                bloqueado: true
            });

            if (jaExisteBloqueado) {
                // Desbloqueia direto — sem verificar limite
                await Programa.updateOne(
                    { _id: jaExisteBloqueado._id },
                    { bloqueado: false }
                );
                return res.status(200).json({
                    message: `Programa "${programaCatalogo.nome}" desbloqueado!`,
                    programa: jaExisteBloqueado,
                });
            }


            const programa = await Programa.create({
                nome: programaCatalogo.nome,
                descricao: programaCatalogo.descricao,
                emoji: programaCatalogo.emoji,
                cor: programaCatalogo.cor,
                nivel: programaCatalogo.nivel,
                objetivo: programaCatalogo.objetivo,
                diasPorSemana: programaCatalogo.diasPorSemana,
                usuario: req.usuario._id,
                doCatalogo: true,
                catalogoId: id,
            });

            const Exercicios = (await import('../models/Exercicios.js')).default;

            for (const treinoCat of programaCatalogo.treinos) {
                const exerciciosComIds = await Promise.all(
                    treinoCat.exercicios.map(async (ex, ordem) => {
                        let exercicioEncontrado = await Exercicios.findOne({
                            nome: { $regex: new RegExp(`^${ex.nome}$`, 'i') }
                        });

                        if (!exercicioEncontrado) {
                            const palavras = ex.nome
                                .split(' ')
                                .filter(p => p.length > 3)
                                .map(p => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
                                .slice(0, 3)
                                .join('.*');
                            exercicioEncontrado = await Exercicios.findOne({
                                nome: { $regex: new RegExp(palavras, 'i') }
                            });
                        }

                        if (!exercicioEncontrado) {
                            console.log(`⚠️ Não encontrado: "${ex.nome}"`);
                            return null;
                        }

                        return {
                            exercicio: exercicioEncontrado._id,
                            tipo: ex.tipo ?? 'padrao',
                            serie: ex.serie,
                            repeticoes: String(ex.repeticoes),
                            peso: ex.peso ?? null,
                            tempoDescanso: ex.tempoDescanso ?? 60,
                            tempoTotal: ex.tempoTotal ?? null,
                            tempoPorSerie: ex.tempoPorSerie ?? null,
                            ordem,
                        };
                    })
                );

                const encontrados = exerciciosComIds.filter(Boolean);
                console.log(`✅ Treino "${treinoCat.nome}": ${encontrados.length}/${treinoCat.exercicios.length} exercícios encontrados`);

                await Treino.create({
                    nome: treinoCat.nome,
                    diaSugerido: treinoCat.diaSugerido,
                    exercicios: encontrados,
                    usuario: req.usuario._id,
                    programa: programa._id,
                });
            }

            res.status(201).json({ message: `Programa "${programaCatalogo.nome}" adicionado com sucesso!`, programa });
        } catch (error) {
            console.error('ERRO:', error);
            res.status(500).json({ message: error.message });
        }
    }

    static async migrar(req, res) {
        try {
            let programaPadrao = await Programa.findOne({ usuario: req.usuario._id, nome: 'Meus Treinos' });
            const treinosSemPrograma = await Treino.find({ usuario: req.usuario._id, programa: null });
            if (treinosSemPrograma.length === 0) return res.status(200).json({ message: 'Nenhum treino para migrar.' });
            if (!programaPadrao) {
                programaPadrao = await Programa.create({
                    nome: 'Meus Treinos',
                    descricao: 'Seus treinos personalizados',
                    emoji: '💪',
                    usuario: req.usuario._id,
                });
            }
            await Treino.updateMany({ usuario: req.usuario._id, programa: null }, { programa: programaPadrao._id });
            res.status(200).json({ message: `${treinosSemPrograma.length} treino(s) migrado(s).`, programa: programaPadrao });
        } catch (error) {
            console.error('ERRO:', error);
            res.status(500).json({ message: error.message });
        }
    }
}

export default ProgramaController;