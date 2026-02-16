import nodemailer from "nodemailer";

function getTransporter() {
  // ✅ create on-demand (env loaded by then)
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}
console.log("ENV CHECK", {
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS_EXISTS: !!process.env.EMAIL_PASS,
});
export async function sendEmail({ to, subject, html }) {
  console.log("📨 Sending email via Gmail SMTP:", { to, subject });

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("EMAIL_USER/EMAIL_PASS missing in process.env");
  }

  const transporter = getTransporter();
  return transporter.sendMail({
    from: `"Reel Box" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
}
