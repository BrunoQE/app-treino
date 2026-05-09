import usuario from "../models/Usuario.js";
import jwt from "jsonwebtoken";

function gerarToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

class AuthController {

    // POST /auth/registro
    static async registro(req, res) {
        try {
            const { nome, email, senha } = req.body;

            const senhaExiste = await usuario.findOne({ email });
            if (senhaExiste)
                return res.status(400).json({ message: "Senha já cadastrada" });

            const novoUsuario = await usuario.create({ nome, email, senha });
            const token = gerarToken(novoUsuario._id);

            res.status(200).json({
                message: "Usuário criado com sucesso",
                token,
                usuario: {
                    id: novoUsuario._id,
                    nome: novoUsuario.nome,
                    email: novoUsuario.email
                }
            });

        } catch (error) {
            console.error('ERRO:', error);
            res.status(500).json({ message: error.message });
        }
    }

    // POST /auth/login
    static async login(req, res) {
        try {
            const { email, senha } = req.body;

            // Verifica se usuário existe
            const usuarioEncontrado = await usuario.findOne({ email });
            if (!usuarioEncontrado) {
                return res.status(401).json({ message: "Email ou senha incorretos." });
            }

            // Verifica se a senha está correta
            const senhaValida = await usuarioEncontrado.senhaCorreta(senha);
            if (!senhaValida) {
                return res.status(401).json({ message: "Email ou senha incorretos." });
            }

            const token = gerarToken(usuarioEncontrado._id);

            res.status(200).json({
                message: "Login realizado com sucesso",
                token,
                usuario: {
                    id: usuarioEncontrado._id,
                    nome: usuarioEncontrado.nome,
                    email: usuarioEncontrado.email
                }
            });
        } catch (error) {
            console.error('ERRO:', error);
            res.status(500).json({ message: error.message });
        }
    }

    // GET /auth/perfil — busca dados do usuário logado
    static async buscarPerfil(req, res) {
        try {
            const usuarioEncontrado = await usuario.findById(req.usuario._id).select('-senha');
            res.status(200).json(usuarioEncontrado);
        } catch (error) {
            console.error('ERRO:', error);
            res.status(500).json({ message: error.message });
        }
    }

    // PUT /auth/perfil — atualiza perfil
    static async atualizarPerfil(req, res) {
        try {
            const { nome, email, senhaAtual, novaSenha, fotoPerfil } = req.body;
            const usuarioEncontrado = await usuario.findById(req.usuario._id);

            // Atualiza nome
            if (nome) usuarioEncontrado.nome = nome.trim();

            // Atualiza email — verifica se já existe
            if (email && email !== usuarioEncontrado.email) {
                const emailExiste = await usuario.findOne({ email, _id: { $ne: req.usuario._id } });
                if (emailExiste) {
                    return res.status(400).json({ message: 'Este email já está em uso.' });
                }
                usuarioEncontrado.email = email.toLowerCase().trim();
            }

            // Atualiza senha — verifica senha atual
            if (novaSenha) {
                if (!senhaAtual) {
                    return res.status(400).json({ message: 'Informe a senha atual para alterá-la.' });
                }
                const senhaValida = await usuarioEncontrado.senhaCorreta(senhaAtual);
                if (!senhaValida) {
                    return res.status(400).json({ message: 'Senha atual incorreta.' });
                }
                if (novaSenha.length < 6) {
                    return res.status(400).json({ message: 'A nova senha deve ter pelo menos 6 caracteres.' });
                }
                usuarioEncontrado.senha = novaSenha; // o pre('save') vai criptografar
            }

            // Atualiza foto
            if (fotoPerfil !== undefined) {
                usuarioEncontrado.fotoPerfil = fotoPerfil;
            }

            await usuarioEncontrado.save();

            // Atualiza AsyncStorage com novos dados
            const dadosAtualizados = {
                id: usuarioEncontrado._id,
                nome: usuarioEncontrado.nome,
                email: usuarioEncontrado.email,
                fotoPerfil: usuarioEncontrado.fotoPerfil,
            };

            res.status(200).json({
                message: 'Perfil atualizado com sucesso',
                usuario: dadosAtualizados
            });
        } catch (error) {
            console.error('ERRO:', error);
            res.status(500).json({ message: error.message });
        }
    }
}

export default AuthController;