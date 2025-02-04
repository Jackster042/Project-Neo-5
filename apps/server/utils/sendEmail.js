const nodemailer = require("nodemailer");
const pug = require("pug");
const { convert } = require("html-to-text");

class Email {
  constructor(user, url) {
    this.to = user.email;
    this.from = `Project NEO 5 <feemail042@gmail.com>`;
    this.username = user.username;
    this.url = url;
  }

  //   NODE_MAILER TRANSPORTER
  newTransport() {
    if (process.env.NODE_ENV === "production") {
      return;
    } else {
      return nodemailer.createTransport({
        host: process.env.MAILTRAP_EMAIL_HOST,
        port: process.env.MAILTRAP_EMAIL_PORT,
        auth: {
          user: process.env.MAILTRAP_EMAIL_USERNAME,
          pass: process.env.MAILTRAP_EMAIL_PASSWORD,
        },
      });
    }
  }

  //   WELCOME EMAIL
  async sendWelcome() {
    await this.send("welcome", "Welcome to Project NEO 5");
  }

  async send(template, subject) {
    // HTML
    const html = pug.renderFile(`${__dirname}/../views/${template}.pug`, {
      email: this.to,
      username: this.username,
      url: this.url,
    });
    // OPTIONS
    const mailOptions = {
      to: this.to,
      from: this.from,
      subject,
      html,
      text: convert(html),
    };
    // SEND MAIL
    await this.newTransport().sendMail(mailOptions);
  }
}

module.exports = Email;
