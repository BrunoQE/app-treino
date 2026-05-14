import express from 'express';
import ProgramaController from '../controllers/ProgramaController.js';

const routes = express.Router();

routes.get('/programas', ProgramaController.listar);
routes.post('/programas', ProgramaController.criar);
routes.put('/programas/:id', ProgramaController.editar);
routes.delete('/programas/:id', ProgramaController.deletar);
routes.get('/programas/catalogo', ProgramaController.listarCatalogo);
routes.post('/programas/catalogo/:id/adicionar', ProgramaController.adicionarDoCatalogo);
routes.post('/programas/migrar', ProgramaController.migrar);

export default routes;