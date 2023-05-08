const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const dotenv = require('dotenv');
const path = require('path');

if (process.env.NODE_ENV === 'development') {
  dotenv.config({ path: '.env.development.local' });
} else {
  dotenv.config({ path: '.env.production.local' });
}

const sendPasswordResetEmail = async (firstName, email, resetCode) => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAILER_SERVICE,
    port: 465,
    secure: true, // use TLS
    auth: {
      user: process.env.MAILER_USER,
      pass: process.env.MAILER_PASS,
    },
  });

  // Set up email template options
  const handlebarsOptions = {
    viewEngine: {
      partialsDir: path.resolve('./public/views/partials'),
      defaultLayout: false,
    },
    viewPath: path.resolve('./public/views/email'),
    extName: '.hbs',
  };

  // Use the nodemailer-express-handlebars plugin with our transporter and options
  transporter.use('compile', hbs(handlebarsOptions));

  // Set up email options
  const mailOptions = {
    from: 'Flavor Dash <hello@mahnuel.com>',
    to: email,
    subject: 'Reset Password',
    template: 'passwordReset',
    context: {
      resetCode: resetCode,
      firstName: firstName,
    },
    attachments: [
      {
        filename: 'flavordash.png',
        path: path.resolve('./public/assets/flavordash.png'),
        cid: 'flavordash',
        contentDisposition: 'inline',
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Reset code email sent');
  } catch (err) {
    console.error('Error sending Reset code email:', err);
  }
};

module.exports = { sendPasswordResetEmail };