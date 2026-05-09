import express from "express";
import AuthController from "../controllers/AuthController.js";
import autenticar from "../middlewares/authMiddleware.js";

const routes = express.Router();

routes.post("/auth/registro", AuthController.registro);
routes.post("/auth/login", AuthController.login);
routes.get("/auth/perfil", autenticar, AuthController.buscarPerfil);
routes.put("/auth/perfil", autenticar, AuthController.atualizarPerfil);

export default routes;