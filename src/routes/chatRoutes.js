import express from "express";
import ChatController from "../controllers/ChatController.js";
import autenticar from "../middlewares/authMiddleware.js";

const routes = express.Router();

routes.post("/chat/mensagem", autenticar, ChatController.enviarMensagem);
routes.get("/chat/historico", autenticar, ChatController.buscarHistorico);
routes.delete("/chat/historico", autenticar, ChatController.limparHistorico);

export default routes;