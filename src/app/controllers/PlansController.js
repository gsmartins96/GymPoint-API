import * as Yup from 'yup';
import Plans from '../models/Plans';

class PlansController {
  async index(req, res) {
    const plans = await Plans.findAll();

    return res.json(plans);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number()
        .positive()
        .required(),
      price: Yup.number()
        .positive()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const title = req.body;
    const planTitleExists = await Plans.findOne({
      where: {
        title: req.body.title,
      },
    });

    if (planTitleExists) {
      return res
        .status(400)
        .json({ error: 'We already a plan with this name' });
    }

    const { id, duration, price } = await Plans.create(req.body);

    return res.json({ id, title, duration, price });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      duration: Yup.number().positive(),
      price: Yup.number().positive(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    if (req.body.title != null) {
      const planTitleExists = await Plans.findOne({
        where: {
          title: req.body.title,
        },
      });

      if (planTitleExists) {
        return res
          .status(400)
          .json({ error: 'We already a plan with this name' });
      }
    }

    const plan = await Plans.findByPk(req.params.id);
    const { title, duration, price } = await plan.update(req.body);

    return res.json({
      title,
      duration,
      price,
    });
  }
}

export default new PlansController();
