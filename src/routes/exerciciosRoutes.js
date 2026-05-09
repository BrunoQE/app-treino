import express from "express";
import ExercicioController from "../controllers/ExercicioController.js";

const routes = express.Router();

routes.get("/exercicios", ExercicioController.listarExercicios);
routes.get("/exercicios/busca", ExercicioController.listarExercicioPorGrupoMuscular);
routes.get("/exercicios/:id", ExercicioController.listarExercicioPorId);


routes.post("/exercicios", ExercicioController.cadastrarExercicio);

routes.put("/exercicios/:id", ExercicioController.alterarExercicio);

routes.delete("/exercicios/:id", ExercicioController.removerExercicio);

export default routes;