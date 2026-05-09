import jwt from "jsonwebtoken";
import usuario from "../models/Usuario.js";

async function autenticar(req, res, next) {
    try {
        // Verifica se o token foi enviado no header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: "Acesso negado. Token não fornecido." });
        }

        // Extrai o token do header "Bearer TOKEN"
        const token = authHeader.split(' ')[1];

        // Valida o token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Busca o usuário e anexa na requisição
        const usuarioLogado = await usuario.findById(decoded.id);
        if (!usuarioLogado) {
            return res.status(401).json({ message: "Usuário não encontrado." });
        }

        req.usuario = usuarioLogado; // disponível em todos os controllers protegidos
        next();
    } catch (error) {
        res.status(401).json({ message: `${error.message} - Token inválido ou expirado.` });
    }
}

export default autenticar;