
import nodemailer from "nodemailer";

// function getTransporter() {
//   return nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });
// }

export function getTransporter() {

  return nodemailer.createTransport({

    // Explicit Gmail SMTP host (more reliable)
    host: "smtp.gmail.com",

    // Port 587 = TLS (recommended)
    port: 465,

    secure: true,

    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },

    // Optional but recommended for Node 18+ / Windows SSL stability
    tls: {
      minVersion: "TLSv1.2",
      rejectUnauthorized: false, // helps in localhost/dev
    },

  });

}

export async function sendEmail({ to, subject, html }) {
  // console.log("ENV CHECK", {
  //   EMAIL_USER_EXISTS: !!process.env.EMAIL_USER,
  //   EMAIL_PASS_EXISTS: !!process.env.EMAIL_PASS,
  // });

  // console.log("SMTP ready");
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("EMAIL_USER/EMAIL_PASS missing in process.env");
  }

  const transporter = getTransporter();
  // console.log("MAILER OPTIONS =>", transporter.options);
  await transporter.verify();
  return transporter.sendMail({
    from: `"Reel Box" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
}
