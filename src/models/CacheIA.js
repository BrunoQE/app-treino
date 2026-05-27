import mongoose from "mongoose";

const cacheIASchema = new mongoose.Schema({
    usuario: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'usuarios', 
        required: true 
    },
    tipo: { 
        type: String, 
        required: true,
        enum: ['personal_ia', 'analytics_ia']
    },
    resultado: { 
        type: mongoose.Schema.Types.Mixed, 
        required: true 
    },
    criadoEm: { 
        type: Date, 
        default: Date.now,
        expires: 7200 // TTL automático: MongoDB deleta após 2 horas
    },
}, { versionKey: false });

// Índice para busca rápida por usuário + tipo
cacheIASchema.index({ usuario: 1, tipo: 1 });

const CacheIA = mongoose.model('cache_ia', cacheIASchema);

export default CacheIA;