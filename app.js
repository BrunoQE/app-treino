import express from "express";
import conectaNaDatabase from "./src/config/dbConnect.js";
import routes from "./src/routes/index.js";

console.log('Variáveis:', {
    STRING_CONNECTION_DB: process.env.STRING_CONNECTION_DB ? 'DEFINIDA ✅' : 'UNDEFINED ❌',
    JWT_SECRET: process.env.JWT_SECRET ? 'DEFINIDA ✅' : 'UNDEFINED ❌',
});

const conexao = await conectaNaDatabase();

conexao.on("error", (erro) => {
    console.error("erro de conexão: ", erro);
});

conexao.once("open", () => {
    console.log("conexão com o banco feita com sucesso.");
});

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

routes(app);

export default app;