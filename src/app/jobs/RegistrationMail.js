import Mail from '../../lib/Mail';

class RegistrationMail {
  get key() {
    return 'RegistrationMail';
  }

  async handle({ data }) {
    const { student, plan, formattedEndDate, price } = data;

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
  }
}

export default new RegistrationMail();
