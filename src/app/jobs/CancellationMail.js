import Mail from '../../lib/Mail';

class CancellationMail {
  get key() {
    return 'CancellationMail';
  }

  async handle({ data }) {
    const { student } = data;

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Cancelamento de Matricula',
      template: 'cancelled_registration',
      context: {
        user: student.name,
      },
    });
  }
}

export default new CancellationMail();
