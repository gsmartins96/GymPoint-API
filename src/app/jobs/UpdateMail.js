import Mail from '../../lib/Mail';

class UpdateMail {
  get key() {
    return 'UpdateMail';
  }

  async handle({ data }) {
    const { student, plan, formattedEndDate, price } = data;

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
  }
}

export default new UpdateMail();
