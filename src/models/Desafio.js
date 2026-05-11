import mongoose from "mongoose";

const desafioSchema = new mongoose.Schema({
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    semana: { type: String, required: true }, // formato: "2026-W20"
    nivel: { type: String, enum: ['Iniciante', 'Intermediario', 'Avancado'], required: true },
    desafios: [{
        tipo: { type: String, required: true },
        descricao: { type: String, required: true },
        meta: { type: Number, required: true },
        progresso: { type: Number, default: 0 },
        concluido: { type: Boolean, default: false },
        pontos: { type: Number, default: 10 },
    }],
    badges: [{ type: String }],
    concluido: { type: Boolean, default: false },
}, { timestamps: true, versionKey: false });

export default mongoose.model('Desafio', desafioSchema);