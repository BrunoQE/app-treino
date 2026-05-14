import usuario from "../models/Usuario.js";
import crypto from "crypto";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

class ResetSenhaController {

    // POST /auth/esqueci-senha
    static async esqueceuSenha(req, res) {
        try {
            const { email } = req.body;
            if (!email) return res.status(400).json({ message: "Informe o email." });

            const usuarioEncontrado = await usuario.findOne({
                email: email.toLowerCase().trim()
            });

            if (!usuarioEncontrado) {
                return res.status(200).json({ message: 'Se este email estiver cadastrado, você receberá o código.' });
            }

            const codigo = crypto.randomInt(100000, 999999).toString();
            const expira = new Date(Date.now() + 15 * 60 * 1000);

            usuarioEncontrado.codigoReset = codigo;
            usuarioEncontrado.codigoResetExpira = expira;
            await usuarioEncontrado.save();

            await resend.emails.send({
                from: `"Treino Absoluto" <${process.env.EMAIL_USER}>`,
                to: usuarioEncontrado.email,
                subject: 'Código de recuperação de senha',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #111; color: #fff; border-radius: 12px; padding: 32px;">
                        <h2 style="color: #FF6B2B; margin-bottom: 8px;">💪 Treino Absoluto</h2>
                        <p style="color: #aaa; margin-bottom: 24px;">Recuperação de senha</p>
                        <p>Seu código de verificação é:</p>
                        <div style="background: #1A1A1A; border: 2px solid #FF6B2B; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
                            <span style="font-size: 40px; font-weight: bold; letter-spacing: 8px; color: #FF6B2B;">${codigo}</span>
                        </div>
                        <p style="color: #aaa; font-size: 13px;">Este código expira em <strong style="color: #fff;">15 minutos</strong>.</p>
                        <p style="color: #aaa; font-size: 13px;">Se você não solicitou isso, ignore este email.</p>
                        <hr style="border-color: #333; margin: 24px 0;">
                        <p style="color: #555; font-size: 11px; text-align: center;">Treino Absoluto · treinoabsoluto.app</p>
                    </div>
                `,
            });

            res.status(200).json({
                message: 'Se este email estiver cadastrado, você receberá o código.'
            });

        } catch (error) {
            console.error('ERRO:', error);
            res.status(500).json({ message: error.message });
        }
    }

    // POST /auth/verificar-codigo
    static async verificarCodigo(req, res) {
        try {
            const { email, codigo } = req.body;
            if (!email || !codigo) {
                return res.status(400).json({ message: 'Informe email e código.' });
            }

            const usuarioEncontrado = await usuario.findOne({
                email: email.toLowerCase().trim()
            });

            if (!usuarioEncontrado?.codigoReset) {
                return res.status(400).json({ message: 'Código inválido ou expirado.' });
            }

            if (usuarioEncontrado.codigoReset !== codigo) {
                return res.status(400).json({ message: 'Código incorreto.' });
            }

            if (new Date() > usuarioEncontrado.codigoResetExpira) {
                return res.status(400).json({ message: 'Código expirado. Solicite um novo.' });
            }

            res.status(200).json({ message: 'Código válido.' });
        } catch (error) {
            console.error('ERRO:', error);
            res.status(500).json({ message: error.message });
        }
    }

    // POST /auth/redefinir-senha
    static async redefinirSenha(req, res) {
        try {
            const { email, codigo, novaSenha } = req.body;
            if (!email || !codigo || !novaSenha) {
                return res.status(400).json({ message: 'Dados incompletos.' });
            }

            if (novaSenha.length < 6) {
                return res.status(400).json({ message: 'Senha deve ter pelo menos 6 caracteres.' });
            }

            const usuarioEncontrado = await usuario.findOne({
                email: email.toLowerCase().trim()
            });

            if (!usuarioEncontrado?.codigoReset) {
                return res.status(400).json({ message: 'Código inválido ou expirado.' });
            }

            if (usuarioEncontrado.codigoReset !== codigo) {
                return res.status(400).json({ message: 'Código incorreto.' });
            }

            if (new Date() > usuarioEncontrado.codigoResetExpira) {
                return res.status(400).json({ message: 'Código expirado. Solicite um novo.' });
            }

            // Atualiza senha e limpa o código
            usuarioEncontrado.senha = novaSenha;
            usuarioEncontrado.codigoReset = null;
            usuarioEncontrado.codigoResetExpira = null;
            await usuarioEncontrado.save();

            res.status(200).json({ message: 'Senha redefinida com sucesso!' });
        } catch (error) {
            console.error('ERRO:', error);
            res.status(500).json({ message: error.message });
        }
    }

}

export default ResetSenhaController;