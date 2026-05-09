import express from "express";
import conectaNaDatabase from "./src/config/dbConnect.js";
import routes from "./src/routes/index.js";

console.log('Variáveis de ambiente:', {
    STRING_CONNECTION_DB: process.env.STRING_CONNECTION_DB ? 'DEFINIDA ✅' : 'UNDEFINED ❌',
    JWT_SECRET: process.env.JWT_SECRET ? 'DEFINIDA ✅' : 'UNDEFINED ❌',
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
});

const conexao = await conectaNaDatabase();

conexao.on("error", (erro) => {
    console.error("erro de conexão: ", erro);
});

conexao.once("open", () => {
    console.log("conexão com o banco feita com sucesso.");
});

const app = express();
routes(app);

export default app;