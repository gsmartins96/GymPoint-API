import { Router } from 'express';
import User from './app/models/User';

const routes = new Router();

routes.get('/', async (req, res) => {
  const user = await User.create({
    nome: 'Teste de criação',
    email: 'teste@criacao.com',
    password_hash: 'passdeteste',
  });

  return res.json(user);
});

export default routes;
