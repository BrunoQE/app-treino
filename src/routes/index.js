import express from "express";
import treino from "../routes/treinosRoutes.js";
import exercicio from "../routes/exerciciosRoutes.js";
import auth from "../routes/authRoutes.js";
import historico from "../routes/historicoRoutes.js";
import autenticar from "../middlewares/authMiddleware.js";
import desafio from "../routes/desafioRouters.js";
import resetSenhaRoutes from "../routes/resetSenhaRoutes.js";

const routes = (app) => {
    app.route("/").get((req, res) => res.status(200).send("Treino Certo API"));

    // Rotas públicas
    app.use(express.json(), auth, resetSenhaRoutes);

    // Rotas protegidas
    app.use(express.json(), autenticar, treino, exercicio, historico, desafio);
};

export default routes;