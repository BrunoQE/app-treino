import Programa from '../models/Programa.js';
import Treino from '../models/Treino.js';

// Catálogo de programas prontos
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
                    { nome: 'Crossover na polia', serie: 3, repeticoes: '12-15', tempoDescanso: 60 },
                    { nome: 'Flexão de braço declinada', serie: 3, repeticoes: 'até falhar', tempoDescanso: 60 },
                ],
            },
            {
                nome: 'Ombros — Shape de Praia',
                diaSugerido: 'Quarta',
                exercicios: [
                    { nome: 'Desenvolvimento com barra', serie: 4, repeticoes: '8-10', tempoDescanso: 90 },
                    { nome: 'Elevação lateral com halteres', serie: 4, repeticoes: '12-15', tempoDescanso: 60 },
                    { nome: 'Elevação frontal alternada', serie: 3, repeticoes: '12', tempoDescanso: 60 },
                    { nome: 'Remada alta com barra', serie: 3, repeticoes: '10-12', tempoDescanso: 75 },
                    { nome: 'Encolhimento com halteres', serie: 3, repeticoes: '15-20', tempoDescanso: 45 },
                ],
            },
            {
                nome: 'Braços — Shape de Praia',
                diaSugerido: 'Sexta',
                exercicios: [
                    { nome: 'Rosca direta com barra', serie: 4, repeticoes: '10-12', tempoDescanso: 75 },
                    { nome: 'Rosca alternada com halteres', serie: 3, repeticoes: '10-12', tempoDescanso: 60 },
                    { nome: 'Rosca concentrada', serie: 3, repeticoes: '12-15', tempoDescanso: 45 },
                    { nome: 'Tríceps na polia alta', serie: 4, repeticoes: '12-15', tempoDescanso: 60 },
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
                    { nome: 'Crossover na polia', serie: 3, repeticoes: '12-15', tempoDescanso: 60 },
                    { nome: 'Tríceps na polia (corda)', serie: 4, repeticoes: '12-15', tempoDescanso: 60 },
                    { nome: 'Tríceps testa com barra W', serie: 3, repeticoes: '10-12', tempoDescanso: 75 },
                ],
            },
            {
                nome: 'Costas e Bíceps',
                diaSugerido: 'Terça',
                exercicios: [
                    { nome: 'Barra fixa pronada', serie: 4, repeticoes: '6-10', tempoDescanso: 120 },
                    { nome: 'Remada curvada com barra', serie: 4, repeticoes: '8-10', tempoDescanso: 90 },
                    { nome: 'Puxada na polia alta', serie: 3, repeticoes: '10-12', tempoDescanso: 75 },
                    { nome: 'Remada unilateral com haltere', serie: 3, repeticoes: '10-12', tempoDescanso: 60 },
                    { nome: 'Rosca direta com barra', serie: 3, repeticoes: '10-12', tempoDescanso: 60 },
                    { nome: 'Rosca scott', serie: 3, repeticoes: '12-15', tempoDescanso: 45 },
                ],
            },
            {
                nome: 'Pernas',
                diaSugerido: 'Quinta',
                exercicios: [
                    { nome: 'Agachamento livre com barra', serie: 4, repeticoes: '8-10', tempoDescanso: 120 },
                    { nome: 'Leg press 45°', serie: 4, repeticoes: '10-12', tempoDescanso: 90 },
                    { nome: 'Cadeira extensora', serie: 3, repeticoes: '12-15', tempoDescanso: 60 },
                    { nome: 'Stiff com barra', serie: 4, repeticoes: '10-12', tempoDescanso: 90 },
                    { nome: 'Cadeira flexora', serie: 3, repeticoes: '12-15', tempoDescanso: 60 },
                    { nome: 'Panturrilha em pé na máquina', serie: 4, repeticoes: '15-20', tempoDescanso: 45 },
                ],
            },
            {
                nome: 'Ombros e Abdômen',
                diaSugerido: 'Sexta',
                exercicios: [
                    { nome: 'Desenvolvimento com halteres', serie: 4, repeticoes: '8-12', tempoDescanso: 90 },
                    { nome: 'Elevação lateral com halteres', serie: 4, repeticoes: '12-15', tempoDescanso: 60 },
                    { nome: 'Elevação posterior (voador inverso)', serie: 3, repeticoes: '12-15', tempoDescanso: 60 },
                    { nome: 'Abdominal na polia', serie: 3, repeticoes: '15-20', tempoDescanso: 45 },
                    { nome: 'Prancha isométrica', serie: 3, repeticoes: '45 seg', tempoDescanso: 45 },
                    { nome: 'Elevação de pernas', serie: 3, repeticoes: '15-20', tempoDescanso: 45 },
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
                    { nome: 'Agachamento sumô com haltere', serie: 4, repeticoes: '12-15', tempoDescanso: 75 },
                    { nome: 'Leg press com pés altos', serie: 4, repeticoes: '12-15', tempoDescanso: 75 },
                    { nome: 'Agachamento búlgaro', serie: 3, repeticoes: '10-12 por perna', tempoDescanso: 75 },
                    { nome: 'Cadeira extensora', serie: 3, repeticoes: '15-20', tempoDescanso: 45 },
                    { nome: 'Passada com halteres', serie: 3, repeticoes: '12 por perna', tempoDescanso: 60 },
                ],
            },
            {
                nome: 'Glúteos e Posteriores',
                diaSugerido: 'Quarta',
                exercicios: [
                    { nome: 'Elevação pélvica com barra', serie: 4, repeticoes: '12-15', tempoDescanso: 75 },
                    { nome: 'Stiff com halteres', serie: 4, repeticoes: '12-15', tempoDescanso: 75 },
                    { nome: 'Kickback na polia baixa', serie: 3, repeticoes: '15 por perna', tempoDescanso: 45 },
                    { nome: 'Cadeira flexora', serie: 3, repeticoes: '12-15', tempoDescanso: 60 },
                    { nome: 'Abdução de quadril na máquina', serie: 4, repeticoes: '15-20', tempoDescanso: 45 },
                ],
            },
            {
                nome: 'Glúteos e Panturrilhas',
                diaSugerido: 'Sexta',
                exercicios: [
                    { nome: 'Agachamento livre com barra', serie: 4, repeticoes: '10-12', tempoDescanso: 90 },
                    { nome: 'Elevação pélvica unilateral', serie: 3, repeticoes: '12 por perna', tempoDescanso: 60 },
                    { nome: 'Adutor na máquina', serie: 3, repeticoes: '15-20', tempoDescanso: 45 },
                    { nome: 'Panturrilha em pé na máquina', serie: 4, repeticoes: '15-20', tempoDescanso: 45 },
                    { nome: 'Panturrilha sentada na máquina', serie: 3, repeticoes: '15-20', tempoDescanso: 45 },
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
                    { nome: 'Agachamento frontal', serie: 3, repeticoes: '5-6', tempoDescanso: 150 },
                    { nome: 'Leg press 45°', serie: 3, repeticoes: '8-10', tempoDescanso: 120 },
                    { nome: 'Cadeira extensora', serie: 3, repeticoes: '10-12', tempoDescanso: 90 },
                    { nome: 'Good morning', serie: 3, repeticoes: '8-10', tempoDescanso: 90 },
                ],
            },
            {
                nome: 'Dia do Supino',
                diaSugerido: 'Terça',
                exercicios: [
                    { nome: 'Supino reto com barra', serie: 5, repeticoes: '3-5', tempoDescanso: 180 },
                    { nome: 'Supino inclinado com barra', serie: 3, repeticoes: '5-6', tempoDescanso: 150 },
                    { nome: 'Desenvolvimento com barra (press militar)', serie: 3, repeticoes: '5-8', tempoDescanso: 120 },
                    { nome: 'Paralelas com peso', serie: 3, repeticoes: '6-8', tempoDescanso: 120 },
                    { nome: 'Tríceps na polia (barra reta)', serie: 3, repeticoes: '10-12', tempoDescanso: 75 },
                ],
            },
            {
                nome: 'Dia do Levantamento Terra',
                diaSugerido: 'Quinta',
                exercicios: [
                    { nome: 'Levantamento terra convencional', serie: 5, repeticoes: '3-5', tempoDescanso: 180 },
                    { nome: 'Levantamento terra romeno', serie: 3, repeticoes: '6-8', tempoDescanso: 150 },
                    { nome: 'Remada curvada com barra', serie: 4, repeticoes: '6-8', tempoDescanso: 120 },
                    { nome: 'Barra fixa pronada com peso', serie: 3, repeticoes: '6-8', tempoDescanso: 120 },
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
                    { nome: 'Agachamento livre', serie: 3, repeticoes: '10-12', tempoDescanso: 90 },
                    { nome: 'Supino reto com halteres', serie: 3, repeticoes: '10-12', tempoDescanso: 75 },
                    { nome: 'Puxada na polia alta (pronada)', serie: 3, repeticoes: '10-12', tempoDescanso: 75 },
                    { nome: 'Desenvolvimento com halteres', serie: 3, repeticoes: '10-12', tempoDescanso: 75 },
                    { nome: 'Rosca direta com halteres', serie: 2, repeticoes: '12-15', tempoDescanso: 60 },
                    { nome: 'Tríceps na polia', serie: 2, repeticoes: '12-15', tempoDescanso: 60 },
                ],
            },
            {
                nome: 'Full Body B',
                diaSugerido: 'Quarta',
                exercicios: [
                    { nome: 'Leg press 45°', serie: 3, repeticoes: '12-15', tempoDescanso: 90 },
                    { nome: 'Supino inclinado com halteres', serie: 3, repeticoes: '10-12', tempoDescanso: 75 },
                    { nome: 'Remada cavalinho', serie: 3, repeticoes: '10-12', tempoDescanso: 75 },
                    { nome: 'Elevação lateral com halteres', serie: 3, repeticoes: '12-15', tempoDescanso: 60 },
                    { nome: 'Rosca scott', serie: 2, repeticoes: '12-15', tempoDescanso: 60 },
                    { nome: 'Tríceps francês com haltere', serie: 2, repeticoes: '12-15', tempoDescanso: 60 },
                ],
            },
            {
                nome: 'Full Body C',
                diaSugerido: 'Sexta',
                exercicios: [
                    { nome: 'Stiff com halteres', serie: 3, repeticoes: '12-15', tempoDescanso: 90 },
                    { nome: 'Crucifixo com halteres', serie: 3, repeticoes: '12-15', tempoDescanso: 60 },
                    { nome: 'Barra fixa supinada', serie: 3, repeticoes: 'máx', tempoDescanso: 90 },
                    { nome: 'Desenvolvimento Arnold', serie: 3, repeticoes: '10-12', tempoDescanso: 75 },
                    { nome: 'Rosca martelo', serie: 2, repeticoes: '12-15', tempoDescanso: 60 },
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
                    { nome: 'Flexão de braço', serie: 3, repeticoes: '15-20', tempoDescanso: 30 },
                    { nome: 'Remada com haltere', serie: 3, repeticoes: '15', tempoDescanso: 30 },
                    { nome: 'Desenvolvimento com halteres', serie: 3, repeticoes: '15', tempoDescanso: 30 },
                    { nome: 'Supino com halteres', serie: 3, repeticoes: '12-15', tempoDescanso: 45 },
                    { nome: 'Burpee', serie: 3, repeticoes: '10', tempoDescanso: 60 },
                ],
            },
            {
                nome: 'Cardio HIIT',
                diaSugerido: 'Terça',
                exercicios: [
                    { nome: 'Sprint na esteira (30s corrida / 30s pausa)', serie: 10, repeticoes: '30 seg', tempoDescanso: 30 },
                    { nome: 'Pulo na caixa (box jump)', serie: 3, repeticoes: '10', tempoDescanso: 60 },
                    { nome: 'Corda (jumping rope)', serie: 3, repeticoes: '60 seg', tempoDescanso: 30 },
                    { nome: 'Mountain climber', serie: 3, repeticoes: '30 seg', tempoDescanso: 30 },
                ],
            },
            {
                nome: 'Inferior — Queima Total',
                diaSugerido: 'Quarta',
                exercicios: [
                    { nome: 'Agachamento com salto', serie: 3, repeticoes: '12-15', tempoDescanso: 60 },
                    { nome: 'Passada alternada com halteres', serie: 3, repeticoes: '12 por perna', tempoDescanso: 60 },
                    { nome: 'Leg press 45°', serie: 3, repeticoes: '15-20', tempoDescanso: 60 },
                    { nome: 'Elevação pélvica', serie: 3, repeticoes: '15-20', tempoDescanso: 45 },
                    { nome: 'Step up na caixa', serie: 3, repeticoes: '12 por perna', tempoDescanso: 45 },
                ],
            },
            {
                nome: 'Core e Cardio',
                diaSugerido: 'Quinta',
                exercicios: [
                    { nome: 'Abdominal supra', serie: 3, repeticoes: '20-25', tempoDescanso: 30 },
                    { nome: 'Abdominal infra', serie: 3, repeticoes: '15-20', tempoDescanso: 30 },
                    { nome: 'Prancha lateral', serie: 3, repeticoes: '30 seg por lado', tempoDescanso: 30 },
                    { nome: 'Bicicleta abdominal', serie: 3, repeticoes: '30 seg', tempoDescanso: 30 },
                    { nome: 'Cardio leve: elíptico ou bicicleta', serie: 1, repeticoes: '20 min', tempoDescanso: 0 },
                ],
            },
            {
                nome: 'Full Body Metabólico',
                diaSugerido: 'Sexta',
                exercicios: [
                    { nome: 'Agachamento com halteres', serie: 4, repeticoes: '15', tempoDescanso: 20 },
                    { nome: 'Flexão de braço', serie: 4, repeticoes: '15', tempoDescanso: 20 },
                    { nome: 'Remada com haltere', serie: 4, repeticoes: '15', tempoDescanso: 20 },
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
                    { nome: 'Supino reto com barra (pirâmide)', serie: 5, repeticoes: '12/10/8/6/4', tempoDescanso: 90 },
                    { nome: 'Supino inclinado com halteres', serie: 4, repeticoes: '10-12', tempoDescanso: 75 },
                    { nome: 'Supino declinado com barra', serie: 3, repeticoes: '10-12', tempoDescanso: 75 },
                    { nome: 'Crucifixo inclinado com halteres', serie: 3, repeticoes: '12-15', tempoDescanso: 60 },
                    { nome: 'Crossover na polia', serie: 3, repeticoes: '15-20', tempoDescanso: 45 },
                ],
            },
            {
                nome: 'Costas — Atleta Completo',
                diaSugerido: 'Terça',
                exercicios: [
                    { nome: 'Levantamento terra', serie: 4, repeticoes: '6-8', tempoDescanso: 150 },
                    { nome: 'Barra fixa pronada com peso', serie: 4, repeticoes: '6-10', tempoDescanso: 120 },
                    { nome: 'Remada curvada com barra', serie: 4, repeticoes: '8-10', tempoDescanso: 90 },
                    { nome: 'Puxada na polia (supinada)', serie: 3, repeticoes: '10-12', tempoDescanso: 75 },
                    { nome: 'Remada unilateral com haltere', serie: 3, repeticoes: '10-12', tempoDescanso: 60 },
                ],
            },
            {
                nome: 'Pernas — Atleta Completo',
                diaSugerido: 'Quarta',
                exercicios: [
                    { nome: 'Agachamento livre com barra', serie: 5, repeticoes: '6-10', tempoDescanso: 120 },
                    { nome: 'Leg press 45°', serie: 4, repeticoes: '10-12', tempoDescanso: 90 },
                    { nome: 'Stiff com barra', serie: 4, repeticoes: '8-10', tempoDescanso: 90 },
                    { nome: 'Passada com halteres', serie: 3, repeticoes: '12 por perna', tempoDescanso: 75 },
                    { nome: 'Panturrilha em pé na máquina', serie: 5, repeticoes: '12-20', tempoDescanso: 45 },
                ],
            },
            {
                nome: 'Ombros — Atleta Completo',
                diaSugerido: 'Quinta',
                exercicios: [
                    { nome: 'Desenvolvimento com barra (press militar)', serie: 4, repeticoes: '6-10', tempoDescanso: 90 },
                    { nome: 'Elevação lateral com halteres (drop-set)', serie: 4, repeticoes: '10+10+10', tempoDescanso: 75 },
                    { nome: 'Desenvolvimento Arnold', serie: 3, repeticoes: '10-12', tempoDescanso: 75 },
                    { nome: 'Elevação frontal com barra', serie: 3, repeticoes: '10-12', tempoDescanso: 60 },
                    { nome: 'Crucifixo invertido (voador inverso)', serie: 3, repeticoes: '12-15', tempoDescanso: 60 },
                ],
            },
            {
                nome: 'Braços — Atleta Completo',
                diaSugerido: 'Sexta',
                exercicios: [
                    { nome: 'Rosca direta com barra (21s)', serie: 4, repeticoes: '21 reps', tempoDescanso: 90 },
                    { nome: 'Rosca inclinada com halteres', serie: 3, repeticoes: '10-12', tempoDescanso: 75 },
                    { nome: 'Rosca concentrada', serie: 3, repeticoes: '12-15', tempoDescanso: 45 },
                    { nome: 'Tríceps francês com halteres', serie: 3, repeticoes: '10-12', tempoDescanso: 60 },
                    { nome: 'Rosca punho (antebraço)', serie: 3, repeticoes: '15-20', tempoDescanso: 30 },
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
                    { nome: 'Flexão de braço', serie: 4, repeticoes: '15-20', tempoDescanso: 60 },
                    { nome: 'Flexão de braço inclinada (pés na cadeira)', serie: 3, repeticoes: '12-15', tempoDescanso: 60 },
                    { nome: 'Flexão diamante (tríceps)', serie: 3, repeticoes: '10-15', tempoDescanso: 60 },
                    { nome: 'Remada invertida (embaixo da mesa)', serie: 4, repeticoes: '10-15', tempoDescanso: 75 },
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
                    { nome: 'Elevação pélvica no solo', serie: 4, repeticoes: '20-25', tempoDescanso: 45 },
                    { nome: 'Panturrilha na escada', serie: 4, repeticoes: '20-25', tempoDescanso: 30 },
                ],
            },
            {
                nome: 'Core — Em Casa',
                diaSugerido: 'Quinta',
                exercicios: [
                    { nome: 'Abdominal supra', serie: 3, repeticoes: '25-30', tempoDescanso: 30 },
                    { nome: 'Prancha frontal', serie: 4, repeticoes: '45-60 seg', tempoDescanso: 30 },
                    { nome: 'Prancha lateral', serie: 3, repeticoes: '30 seg por lado', tempoDescanso: 30 },
                    { nome: 'Mountain climber', serie: 3, repeticoes: '30 seg', tempoDescanso: 30 },
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
                    { nome: 'Agachamento unilateral (pistol squat)', serie: 3, repeticoes: '8-10 por perna', tempoDescanso: 90 },
                    { nome: 'Passada com halteres', serie: 3, repeticoes: '12 por perna', tempoDescanso: 75 },
                    { nome: 'Step up com halteres', serie: 3, repeticoes: '10 por perna', tempoDescanso: 75 },
                    { nome: 'Panturrilha unilateral (déficit)', serie: 4, repeticoes: '15-20', tempoDescanso: 45 },
                    { nome: 'Abdução de quadril lateral (elástico)', serie: 3, repeticoes: '20', tempoDescanso: 30 },
                ],
            },
            {
                nome: 'Superior e Core',
                diaSugerido: 'Quarta',
                exercicios: [
                    { nome: 'Barra fixa supinada', serie: 4, repeticoes: '8-10', tempoDescanso: 90 },
                    { nome: 'Remada curvada com halteres', serie: 3, repeticoes: '10-12', tempoDescanso: 75 },
                    { nome: 'Desenvolvimento com halteres', serie: 3, repeticoes: '10-12', tempoDescanso: 75 },
                    { nome: 'Flexão de braço (variações)', serie: 3, repeticoes: '15-20', tempoDescanso: 60 },
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
            const { nivel, objetivo } = req.query;

            const jaAdicionados = await Programa.find({
                usuario: req.usuario._id,
                doCatalogo: true
            }).select('catalogoId');

            const idsAdicionados = jaAdicionados.map(p => p.catalogoId);

            let catalogo = CATALOGO;
            if (nivel) catalogo = catalogo.filter(p => p.nivel === nivel);
            if (objetivo) catalogo = catalogo.filter(p => p.objetivo === objetivo);

            const resultado = catalogo.map(p => ({
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