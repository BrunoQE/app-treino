import express from "express";
import HistoricoController from "../controllers/HistoricoController.js";

const routes = express.Router();

routes.get("/historico/streak", HistoricoController.buscarStreak);
routes.get("/historico/stats", HistoricoController.buscarStats);
routes.get("/historico", HistoricoController.listarHistorico);
routes.get("/historico/recordes", HistoricoController.buscarRecordes);
routes.get("/historico/evolucao", HistoricoController.buscarEvolucao);
routes.get("/historico/volume-semanal", HistoricoController.buscarVolumeSemanal);
routes.get("/historico/frequencia-mensal", HistoricoController.buscarFrequenciaMensal);
routes.get("/historico/comparativo-semanal", HistoricoController.buscarComparativoSemanal);
routes.get("/historico/sugestoes/:treinoId", HistoricoController.buscarSugestoesIA);
routes.post("/historico", HistoricoController.salvarHistorico);

export default routes;