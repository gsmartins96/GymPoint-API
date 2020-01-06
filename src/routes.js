import { Router } from 'express';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middleware/auth';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/session', SessionController.store);

routes.use(authMiddleware);
// A partir daqui, as rotas só são acessadas se tiver um user autenticado
// userId disponível para todas as rodas abaixo

routes.put('/update', UserController.update);

export default routes;
