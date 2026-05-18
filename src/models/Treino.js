import mongoose from "mongoose";

const treinoSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    diaSugerido: {
        type: String,
        enum: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo']
    },
    exercicios: [{
        exercicio: { type: mongoose.Schema.Types.ObjectId, ref: 'exercicios', required: true },
        serie: { type: Number, default: 3 },
        tipo: { type: String, enum: ['padrao', 'cardio', 'isometrico'], default: 'padrao' },
        repeticoes: { type: String },
        peso: { type: Number },
        ordem: { type: Number },
        tempoDescanso: { type: Number, default: 60 },
        tempoTotal: { type: Number },
        tempoPorSerie: { type: Number }
    }],
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'usuarios', required: true },
    programa: { type: mongoose.Schema.Types.ObjectId, ref: 'programas', default: null }
}, { versionKey: false, timestamps: true });

const treino = mongoose.model("treinos", treinoSchema);

export default treino;