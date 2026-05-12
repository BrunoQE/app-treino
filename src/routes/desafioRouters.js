import express from 'express';
import DesafioController from '../controllers/DesafioController.js';

const routes = express.Router();

routes.get('/desafios', DesafioController.buscarDesafios);
routes.get('/desafios/historico', DesafioController.buscarHistorico);
routes.get('/desafios/badges', DesafioController.buscarBadgesConquistados);

export default routes;