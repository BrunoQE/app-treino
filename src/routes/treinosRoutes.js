import express from "express";
import TreinoController from "../controllers/TreinoController.js";

const routes = express.Router();

//rotas de treinos
routes.get("/treinos", TreinoController.listarTreino);
routes.get("/treinos/:id", TreinoController.listarTreinoPorId);
routes.post("/treinos", TreinoController.cadastrarTreino);
routes.put("/treinos/:id", TreinoController.alterarTreino);
routes.delete("/treinos/:id", TreinoController.removerTreino);

//rotas de exercicios dentro de um treino
routes.post("/treinos/:id/exercicios", TreinoController.adicionarExercicioAoTreinoo);
routes.put("/treinos/:id/exercicios/:exId", TreinoController.editarExercicioNoTreino);
routes.delete("/treinos/:id/exercicios/:exId", TreinoController.removerExercicioDoTreino);
routes.patch("/treinos/:id/exercicios/ordem", TreinoController.ordernarExercicios);

export default routes;