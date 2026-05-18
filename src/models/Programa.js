import mongoose from "mongoose";

const programaSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    descricao: { type: String, default: '' },
    emoji: { type: String, default: '💪' },
    cor: { type: String, default: '#FF6B2B' },
    nivel: { type: String, default: null },
    objetivo: { type: String, default: null },
    diasPorSemana: { type: Number, default: null },
    doCatalogo: { type: Boolean, default: false },
    catalogoId: { type: String, default: null },
}, { timestamps: true, versionKey: false });

const programa = mongoose.model('programas', programaSchema);

export default programa;