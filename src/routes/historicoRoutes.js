import express from "express";
import HistoricoController from "../controllers/HistoricoController.js";

const routes = express.Router();

routes.get("/historico/streak", HistoricoController.buscarStreak);
routes.get("/historico/stats", HistoricoController.buscarStats);
routes.get("/historico", HistoricoController.listarHistorico);
routes.get("/historico/recorders", HistoricoController.buscarRecordes);
routes.post("/historico", HistoricoController.salvarHistorico);

export default routes;