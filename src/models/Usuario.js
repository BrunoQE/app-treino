import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const usuarioSchema = new mongoose.Schema({
    nome: { type: String, required: true, trim: true },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    senha: { type: String, required: true, minlenght: 6 },
    fotoPerfil: { type: String, default: null },
    codigoReset: { type: String, default: null },
    codigoResetExpira: { type: Date, default: null },

    // ── PLANO ────────────────────────────────────────────────────────
    plano: {
        type: String,
        enum: ['free', 'pro'],
        default: 'free',
    },
    planoExpira: {
        type: Date,
        default: null, // null = free ou pro vitalício
    },
    revenuecatId: {
        type: String,
        default: null, // ID do cliente no RevenueCat
    },

}, { versionKey: false, timestamps: true });

usuarioSchema.pre('save', async function () {
    if (!this.isModified('senha')) return;
    this.senha = await bcrypt.hash(this.senha, 12);
});

usuarioSchema.methods.senhaCorreta = async function (senhaDigitada) {
    return await bcrypt.compare(senhaDigitada, this.senha);
};

// Verifica se o plano pro ainda está válido
usuarioSchema.methods.isPro = function () {
    if (this.plano !== 'pro') return false;
    if (!this.planoExpira) return true; // sem data de expiração = pro vitalício
    return new Date() < new Date(this.planoExpira);
};

const usuario = mongoose.model("usuarios", usuarioSchema);

export default usuario;