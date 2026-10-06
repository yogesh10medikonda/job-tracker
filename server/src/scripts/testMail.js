require("dotenv").config();
const { sendMail } = require("../utils/mailer");

sendMail({
  to: process.env.SMTP_USER,
  subject: "Job Tracker test",
  text: "Email is working.",
})
  .then(() => console.log("Sent! Check your inbox."))
  .catch((e) => console.error("Failed:", e.message));