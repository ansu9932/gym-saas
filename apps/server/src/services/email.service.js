import nodemailer from "nodemailer";
import { env } from "../config/env.js";

let transporter;

const canSendEmail = Boolean(
  env.smtp.host && env.smtp.user && env.smtp.pass && env.smtp.from
);

const getTransporter = () => {
  if (!canSendEmail) {
    return null;
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.smtp.host,
      port: env.smtp.port,
      secure: env.smtp.port === 465,
      auth: {
        user: env.smtp.user,
        pass: env.smtp.pass
      }
    });
  }

  return transporter;
};

export const sendEmail = async ({ to, subject, html, text }) => {
  const client = getTransporter();

  if (!client) {
    console.info(`Email skipped for ${to}: SMTP is not configured.`);
    return { skipped: true };
  }

  await client.sendMail({
    from: env.smtp.from,
    to,
    subject,
    html,
    text
  });

  return { skipped: false };
};
