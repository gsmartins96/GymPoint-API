import * as Yup from 'yup';
import Student from '../models/Student';

class StudentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      date_of_birth: Yup.date().required(),
      peso: Yup.number()
        .positive()
        .required(),
      altura: Yup.number()
        .positive()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const userExists = await Student.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    const {
      id,
      name,
      email,
      date_of_birth,
      peso,
      altura,
    } = await Student.create(req.body);

    return res.json({
      id,
      name,
      email,
      date_of_birth,
      peso,
      altura,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      oldEmail: Yup.string().email(),
      email: Yup.string()
        .email()
        .when('oldEmail', (oldEmail, field) =>
          oldEmail ? field.required() : field
        ),
      confirmEmail: Yup.string()
        .email()
        .when('email', (email, field) =>
          email ? field.required().oneOf([Yup.ref('email')]) : field
        ),
      date_of_birth: Yup.date(),
      peso: Yup.number().positive(),
      altura: Yup.number().positive(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const email = req.body;

    const student = await Student.findByPk(req.params.id);

    if (email !== student.email) {
      const userExists = await Student.findOne({
        where: {
          email: req.body.email,
        },
      });

      if (userExists) {
        return res.status(400).json({ error: 'User already exists.' });
      }
    }

    const { id, name, date_of_birth, peso, altura } = await student.update(
      req.body
    );

    return res.json({
      id,
      name,
      email,
      date_of_birth,
      peso,
      altura,
    });
  }
}

export default new StudentController();
