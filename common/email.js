const nodeOutlook = require("nodejs-nodemailer-outlook");

exports.sendMail = (userEmail, subject, text) => {
  let promise = new Promise((resolve, reject) => {
    nodeOutlook.sendEmail({
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
      from: process.env.EMAIL,
      to: userEmail,
      subject: subject,

      text: text,
      onError: (e) => {
        console.log("on error ",e);
        reject(e);
      },
      onSuccess: (i) => {
        console.log("success message",i);
        resolve(i);
      },
    });
  });
  return promise;
};
