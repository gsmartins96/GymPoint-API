import { addMonths, format, parseISO } from 'date-fns';
import { pt } from 'date-fns/locale/pt';
import Registration from '../models/Registration';
import Student from '../models/Student';
import Plan from '../models/Plans';
import Mail from '../../lib/Mail';

class RegistrationController {
  async store(req, res) {
    const { student_id, plan_id, start_date } = req.body;
    const plan = await Plan.findByPk(req.body.plan_id);
    const student = await Student.findByPk(req.body.student_id);
    const end_date = addMonths(new Date(start_date), plan.duration);
    const price = plan.price * 3;

    const userRegistration = await Registration.create({
      student_id,
      plan_id,
      start_date,
      end_date,
      price,
    });

    const formattedEndDate = format(end_date, "dd'/'MM'/'yyyy", {
      locale: pt,
    });
    const formattedStartDate = format(parseISO(start_date), "dd'/'MM'/'yyyy", {
      locale: pt,
    });

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Bem vindo ao GymPoint!',
      template: 'registration',
      context: {
        user: student.name,
        plan: plan.title,
        date: formattedEndDate,
        total_price: price,
      },
    });

    return res.json({
      message: `Data de início informada: ${formattedStartDate} Plano selecionado: ${plan.title} Data de término calculada: ${formattedEndDate} (${plan.duration} meses depois do início) Preço calculado: R$${price}`,
      userRegistration,
    });
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
