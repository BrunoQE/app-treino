import mongoose from "mongoose";

const exercicioSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    grupoMuscular: {
        type: String,
        required: true
    },
    descricao: { type: String },
    urlMidia: { type: String },
    exerciseId: { type: String, default: null },
    gifUrl: { type: String, default: null },
    instrucoes: { type: [String], default: [] },
    equipamento: { type: String, default: null },
    dificuldade: { type: String, default: null },
    categoria: { type: String, default: null },
    musculosSecundarios: { type: [String], default: [] },
    partesCorpo: { type: [String], default: [] },
    tipo: { type: String, enum: ['padrao', 'cardio', 'isometrico'], default: 'padrao' }
}, { versionKey: false, timestamps: true });

const exercicio = mongoose.model("exercicios", exercicioSchema);

export default exercicio;