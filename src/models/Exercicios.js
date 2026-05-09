import mongoose from "mongoose";

const exercicioSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    grupoMuscular: {
        type: String,
        required: true,
        enum: ['Peito', 'Costas', 'Pernas', 'Triceps', 'Biceps', 'Ombros', 'Abdominais']
    },
    descricao: { type: String },
    urlMidia: { type: String }
}, { versionKey: false });

const exercicio = mongoose.model("exercicios", exercicioSchema);

export default exercicio;