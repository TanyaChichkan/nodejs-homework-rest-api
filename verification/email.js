const sgMail = require('@sendgrid/mail');
const Mailgen = require('mailgen');
require('dotenv').config();

class EmailService {
  #sender = sgMail;
  #GenerateTemplate = Mailgen;

  #createTemplate(verifyToken) {
    const mailGenerator = new this.#GenerateTemplate({
      theme: 'default',
      product: {
        name: 'Contacts LTD',
        link: 'https://localhost:3000/',
      },
    });

    const template = {
      body: {
        intro: "Welcome to Contacts LTD! We're very excited to have you on board.",
        action: {
          instructions: 'To get started with Contacts LTD, please click here:',
          button: {
            color: '#22BC66',
            text: 'Confirm your account',
            link: `https://localhost:3000/users/verify/:${verifyToken}`,
          },
        },
        outro: "Need help, or have questions? Just reply to this email, we'd love to help.",
      },
    };

    const emailBody = mailGenerator.generate(template);
    return emailBody;
  }
  async sendEmail(verifyToken, email) {
    const emailBody = this.#createTemplate(verifyToken);

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: `${email}`, // Change to your recipient
      from: 't_chichkan@ukr.net', // Change to your verified sender
      subject: 'Sending with SendGrid is Fun',
      html: emailBody,
    };

    await this.#sender.send(msg);
  }
}

module.exports = EmailService;
