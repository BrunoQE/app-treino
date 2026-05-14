import express from "express";
import ResetSenhaController from "../controllers/ResetSenhaController.js";

const routes = express.Router();

routes.post('/auth/esqueci-senha', ResetSenhaController.esqueceuSenha);
routes.post('/auth/verificar-codigo', ResetSenhaController.verificarCodigo);
routes.post('/auth/redefinir-senha', ResetSenhaController.redefinirSenha);

export default routes;