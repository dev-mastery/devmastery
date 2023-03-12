// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
import emailSender from "@sendgrid/mail";
import dotenv from "dotenv";
dotenv.config();

emailSender.setApiKey(process.env.SENDGRID_API_KEY!);
["no-reply@devmastery.com", "bill@devmastery.com"].forEach((email) => {
  const msg = {
    to: "bill@devmastery.com",
    from: email,
    subject: `Test ${email} with SendGrid - ${Date.now()}`,
    text: `Testing the ${email} email address`,
    html: `<strong>Testing the ${email} email address</strong>`,
  };

  emailSender
    .send(msg)
    .then(() => {
      console.log(`Email sent from ${email}`);
    })
    .catch((error) => {
      if (error.response?.body?.errors) {
        console.error(error.response?.body?.errors);
      } else {
        console.error(error);
      }
    });
});
