import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.163.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_EMAIL_PASSWORD,
  }
});

export function sendEmail({
  html,
  subject,
  to = process.env.SENDER_EMAIL_TARGET || ''
}: {
  html: string;
  subject: string;
  to: string;
}) {
  const mailOptions: nodemailer.SendMailOptions = {
    from: process.env.SENDER_EMAIL,
    to,
    subject,
    html,
    // attachments: [
    //   {
    //     filename: 'jobsList.csv',
    //     path: filePath,
    //   }
    // ]
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info: { response: string; }) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}
