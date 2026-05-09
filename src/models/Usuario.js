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
}, { versionKey: false, timestamps: true });

//antes de salvar criptografa a senha automaticamente
usuarioSchema.pre('save', async function () {
    //só criptografa se a senha foi modificada
    if (!this.isModified('senha')) return;
    this.senha = await bcrypt.hash(this.senha, 12);
});

//metodo para comparar a senha na hora do login
usuarioSchema.methods.senhaCorreta = async function (senhaDigitada) {
    return await bcrypt.compare(senhaDigitada, this.senha);
};

const usuario = mongoose.model("usuarios", usuarioSchema);

export default usuario;