import usuario from "../models/Usuario.js";
import programa from "../models/Programa.js";
import jwt from "jsonwebtoken";

function gerarToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

// Helper para retornar dados do usuário padronizados
function dadosUsuario(u) {
    return {
        id: u._id,
        nome: u.nome,
        email: u.email,
        fotoPerfil: u.fotoPerfil,
        plano: u.isPro() ? 'pro' : 'free',
        planoExpira: u.planoExpira,
    };
}

// Bloqueia programas extras quando usuário volta para free
// Mantém apenas o programa mais recente desbloqueado
async function bloquearProgramasExtras(usuarioId) {
    const programas = await programa.find({ usuario: usuarioId })
        .sort({ updatedAt: -1 });

    if (programas.length <= 1) return;

    // O primeiro (mais recente) fica desbloqueado
    const [maisRecente, ...extras] = programas;

    await programa.updateOne(
        { _id: maisRecente._id },
        { bloqueado: false }
    );

    await programa.updateMany(
        { _id: { $in: extras.map(p => p._id) } },
        { bloqueado: true }
    );
}

// Desbloqueia todos quando usuário assina Pro
async function desbloquearTodosProgramas(usuarioId) {
    await programa.updateMany(
        { usuario: usuarioId },
        { bloqueado: false }
    );
}
class AuthController {

    // POST /auth/registro
    static async registro(req, res) {
        try {
            const { nome, email, senha } = req.body;

            const emailExiste = await usuario.findOne({ email });
            if (emailExiste)
                return res.status(400).json({ message: "Email já cadastrado." });

            const novoUsuario = await usuario.create({ nome, email, senha });
            const token = gerarToken(novoUsuario._id);

            res.status(200).json({
                message: "Usuário criado com sucesso",
                token,
                usuario: dadosUsuario(novoUsuario),
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

            const usuarioEncontrado = await usuario.findOne({ email });
            if (!usuarioEncontrado) {
                return res.status(401).json({ message: "Email ou senha incorretos." });
            }

            const senhaValida = await usuarioEncontrado.senhaCorreta(senha);
            if (!senhaValida) {
                return res.status(401).json({ message: "Email ou senha incorretos." });
            }

            const token = gerarToken(usuarioEncontrado._id);

            res.status(200).json({
                message: "Login realizado com sucesso",
                token,
                usuario: dadosUsuario(usuarioEncontrado),
            });
        } catch (error) {
            console.error('ERRO:', error);
            res.status(500).json({ message: error.message });
        }
    }

    // GET /auth/perfil
    static async buscarPerfil(req, res) {
        try {
            const usuarioEncontrado = await usuario.findById(req.usuario._id).select('-senha');
            res.status(200).json({
                ...usuarioEncontrado.toObject(),
                plano: usuarioEncontrado.isPro() ? 'pro' : 'free',
            });
        } catch (error) {
            console.error('ERRO:', error);
            res.status(500).json({ message: error.message });
        }
    }

    // PUT /auth/perfil
    static async atualizarPerfil(req, res) {
        try {
            const { nome, email, senhaAtual, novaSenha, fotoPerfil } = req.body;
            const usuarioEncontrado = await usuario.findById(req.usuario._id);

            if (nome) usuarioEncontrado.nome = nome.trim();

            if (email && email !== usuarioEncontrado.email) {
                const emailExiste = await usuario.findOne({ email, _id: { $ne: req.usuario._id } });
                if (emailExiste) {
                    return res.status(400).json({ message: 'Este email já está em uso.' });
                }
                usuarioEncontrado.email = email.toLowerCase().trim();
            }

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
                usuarioEncontrado.senha = novaSenha;
            }

            if (fotoPerfil !== undefined) {
                usuarioEncontrado.fotoPerfil = fotoPerfil;
            }

            await usuarioEncontrado.save();

            res.status(200).json({
                message: 'Perfil atualizado com sucesso',
                usuario: dadosUsuario(usuarioEncontrado),
            });
        } catch (error) {
            console.error('ERRO:', error);
            res.status(500).json({ message: error.message });
        }
    }

    // POST /auth/webhook-revenuecat
    // RevenueCat chama essa rota quando o usuário assina, cancela ou renova
    static async webhookRevenueCat(req, res) {
        try {
            const { event } = req.body;
            if (!event) return res.status(400).json({ message: 'Evento inválido.' });

            const { type, app_user_id, expiration_at_ms } = event;

            // Busca usuário pelo revenuecatId ou pelo email
            const usuarioEncontrado = await usuario.findOne({
                $or: [
                    { revenuecatId: app_user_id },
                    { email: app_user_id },
                    { _id: app_user_id },
                ]
            });

            if (!usuarioEncontrado) {
                console.log(`[WEBHOOK] Usuário não encontrado: ${app_user_id}`);
                return res.status(200).json({ ok: true }); // RevenueCat precisa de 200
            }

            switch (type) {
                case 'INITIAL_PURCHASE':
                case 'RENEWAL':
                case 'PRODUCT_CHANGE':
                    // Ativou ou renovou o Pro
                    usuarioEncontrado.plano = 'pro';
                    usuarioEncontrado.revenuecatId = app_user_id;
                    usuarioEncontrado.planoExpira = expiration_at_ms ? new Date(expiration_at_ms) : null;
                    await desbloquearTodosProgramas(usuarioEncontrado._id); // ← adiciona
                    break;

                case 'CANCELLATION':
                case 'EXPIRATION':
                    // Cancelou ou expirou — volta para free
                    usuarioEncontrado.plano = 'free';
                    usuarioEncontrado.planoExpira = null;
                    await bloquearProgramasExtras(usuarioEncontrado._id); // ← adiciona
                    break;
                case 'BILLING_ISSUE':
                    // Problema no pagamento — mantém pro por enquanto mas loga
                    console.log(`[WEBHOOK] Billing issue para ${app_user_id}`);
                    break;

                default:
                    console.log(`[WEBHOOK] Evento ignorado: ${type}`);
            }

            await usuarioEncontrado.save();
            console.log(`[WEBHOOK] ${type} processado para ${usuarioEncontrado.email} → plano: ${usuarioEncontrado.plano}`);

            res.status(200).json({ ok: true });
        } catch (error) {
            console.error('ERRO webhook:', error);
            res.status(500).json({ message: error.message });
        }
    }

    // POST /auth/ativar-pro-manual (para testes sem RevenueCat)
    static async ativarProManual(req, res) {
        try {
            const usuarioEncontrado = await usuario.findById(req.usuario._id);
            usuarioEncontrado.plano = 'pro';
            usuarioEncontrado.planoExpira = null;
            await usuarioEncontrado.save();
            await desbloquearTodosProgramas(req.usuario._id); // ← adiciona
            res.status(200).json({
                message: 'Plano Pro ativado com sucesso!',
                usuario: dadosUsuario(usuarioEncontrado),
            });
        } catch (error) {
            console.error('ERRO:', error);
            res.status(500).json({ message: error.message });
        }
    }

    // POST /auth/bloquear-programas-extras (teste)
    static async bloquearProgramasManual(req, res) {
        try {
            const { programaAtivoId } = req.body;
            console.log('programaAtivoId recebido:', programaAtivoId);

            const usuarioEncontrado = await usuario.findById(req.usuario._id);
            usuarioEncontrado.plano = 'free';
            usuarioEncontrado.planoExpira = null;
            await usuarioEncontrado.save();

            const programas = await programa.find({ usuario: req.usuario._id });

            for (const p of programas) {
                // Compara como string para evitar problema de ObjectId vs string
                const deveManterAtivo = p._id.toString() === programaAtivoId?.toString();
                await programa.updateOne(
                    { _id: p._id },
                    { bloqueado: !deveManterAtivo }
                );
                console.log(`${p.nome}: bloqueado=${!deveManterAtivo}`);
            }

            res.status(200).json({ message: 'Plano free e programas bloqueados!' });
        } catch (error) {
            console.error('ERRO:', error);
            res.status(500).json({ message: error.message });
        }
    }
}

export default AuthController;