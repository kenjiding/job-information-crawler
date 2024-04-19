import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.163.com', // 网易邮箱的 SMTP 服务器地址
  port: 465, // SSL 连接的端口号
  secure: true, // 使用 SSL
  auth: {
    user: '13610307032@163.com',
    pass: 'GEPPIPRLOFVZLISU',
  }
});

export function sendEmail({
  html,
  subject,
  to = 'kenjiding807@gmail.com'
}: {
  html: string;
  subject: string;
  to: string;
}) {
  // 准备邮件内容和附件
  const mailOptions: nodemailer.SendMailOptions = {
    from: '13610307032@163.com',  // 发件人
    to, // 收件人
    subject, // 邮件主题
    html,
    // attachments: [
    //   {   // 文件附件
    //     filename: 'jobsList.csv',            // 附件文件名
    //     path: filePath,         // 附件文件路径
    //   }
    // ]
  };

  // 发送邮件
  transporter.sendMail(mailOptions, (error, info: { response: string; }) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}
