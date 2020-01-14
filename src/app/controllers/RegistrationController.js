import * as Yup from 'yup';
import Registration from '../models/Registration';

class RegistrationController {
  async store(req, res) {
    return res.json({ message: 'Rota para registrar um aluno na academia.' });
  }
}

export default RegistrationController();
