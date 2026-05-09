import mongoose from "mongoose";

const historicoSchema = new mongoose.Schema({
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'usuarios', required: true },
    treino: { type: mongoose.Schema.Types.ObjectId, ref: 'treinos' },
    nomeTreino: { type: String, required: true },
    dataInicio: { type: Date, required: true },
    dataFim: { type: Date, required: true },
    duracaoMinutos: { type: Number, required: true },
    exerciciosRealizados: [{
        nome: { type: String },
        grupoMuscular: { type: String },
        serie: { type: Number },
        repeticoes: { type: String },
        peso: { type: Number }
    }]
}, { versionKey: false, timestamps: true });

const historico = mongoose.model('historicos', historicoSchema);

export default historico;