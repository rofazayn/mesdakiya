import nodemailer from 'nodemailer';

const credentials = {
  user: 'nx77xclgfiqythtm@ethereal.email',
  pass: 'aeycEggARSrkf2tUS7',
};

export const sendForgottenPasswordEmail = async (to: string, html: string) => {
  // generate a test account
  // const testAccount = await nodemailer.createTestAccount();
  // console.log('testAccount', testAccount);

  // create a transporter object using default SMTP transport
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: credentials.user,
      pass: credentials.pass,
    },
  });

  const info = await transporter.sendMail({
    to,
    from: '"Mesdakiya" <info@mesdakiya.com>',
    subject: 'Change password',
    html,
  });

  console.log('Message sent %s', info.messageId);
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
};
