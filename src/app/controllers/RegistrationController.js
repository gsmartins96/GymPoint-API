// import * as Yup from 'yup';
import { addMonths } from 'date-fns';
import Registration from '../models/Registration';
import Student from '../models/Student';
import Plan from '../models/Plans';

class RegistrationController {
  async store(req, res) {
    const { student_id, plan_id, start_date } = req.body;
    const plan = await Plan.findByPk(req.body.plan_id);
    const end_date = addMonths(new Date(start_date), plan.duration);
    const price = plan.price * 3;

    const userRegistration = await Registration.create({
      student_id,
      plan_id,
      start_date,
      end_date,
      price,
    });

    return res.json(userRegistration);
  }

  async index(req, res) {
    const userRegister = await Registration.findAll({
      attributes: ['id', 'start_date', 'end_date', 'price'],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['id', 'title', 'duration'],
        },
      ],
    });

    return res.json({
      userRegister,
    });
  }
}

export default new RegistrationController();
