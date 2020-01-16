// import * as Yup from 'yup';
import Registration from '../models/Registration';

class RegistrationController {
  async store(req, res) {
    const {
      student_id,
      plan_id,
      start_date,
      end_date,
      price,
    } = await Registration.create(req.body);

    return res.json({
      student_id,
      plan_id,
      start_date,
      end_date,
      price,
    });
  }
}

export default new RegistrationController();
