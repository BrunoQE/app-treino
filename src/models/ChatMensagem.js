import mongoose from "mongoose";

const chatMensagemSchema = new mongoose.Schema({
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'usuarios', required: true },
    role: { type: String, enum: ['user', 'assistant'], required: true },
    conteudo: { type: String, required: true },
}, { versionKey: false, timestamps: true });

// TTL — mensagens expiram automaticamente após 30 dias
chatMensagemSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 });

const ChatMensagem = mongoose.model("chat_mensagens", chatMensagemSchema);

export default ChatMensagem;