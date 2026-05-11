import express from 'express';
import DesafioController from '../controllers/DesafioController.js';

const routes = express.Router();

routes.get('/desafios', DesafioController.buscarDesafios);
routes.get('/desafios/historico', DesafioController.buscarHistorico);

export default routes;