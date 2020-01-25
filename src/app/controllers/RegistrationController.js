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

    const checkRegistration = await Registration.findOne({
      where: {
        student_id: req.body.student_id,
      },
    });

    if (checkRegistration) {
      return res.status(400).json({ error: 'Student has already a plan' });
    }

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
    const { page = 1 } = req.query;

    const userRegister = await Registration.findAll({
      attributes: ['id', 'start_date', 'end_date', 'price'],
      limit: 20,
      offset: (page - 1) * 20,
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

  // Refactor this :poop: code for update a register
  async update(req, res) {
    const registration = await Registration.findByPk(req.params.id);
    const student = await Student.findByPk(registration.student_id);
    const { plan_id, start_date } = req.body;

    let plan = await registration.plan_id;

    if (plan_id) {
      plan = await Plan.findByPk(plan_id);
    }
    const end_date = addMonths(new Date(start_date), plan.duration);
    const price = plan.price * plan.duration;

    await registration.update({
      plan_id,
      start_date,
      end_date,
      price,
    });

    const formattedEndDate = format(end_date, "dd'/'MM'/'yyyy", {
      locale: pt,
    });

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Atualização de Matricula no GymPoint',
      template: 'update_registration',
      context: {
        user: student.name,
        plan: plan.title,
        date: formattedEndDate,
        total_price: price,
      },
    });

    return res.json({
      plan_id,
      end_date,
      price,
    });
  }

  async delete(req, res) {
    const registration = await Registration.findByPk(req.params.id);
    const student = await Student.findByPk(registration.student_id);

    registration.destroy();

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Cancelamento de Matricula',
      template: 'cancelled_registration',
      context: {
        user: student.name,
      },
    });

    return res.json({
      message: 'Sua matricula foi cancelada. Que pena, espero que volta.',
    });
  }
}

export default new RegistrationController();
