import { createTransport } from "nodemailer";

export interface EmailProps {
  to: string;
  html: string;
  subject: string;
}

export const sendMail = async ({ to, html, subject }: EmailProps) => {
  const transporter = createTransport({
    service: process.env.SMTP_SERVICE,
    host: process.env.SMTP_HOST!,
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASS!,
    },
    ignoreTLS: Boolean(process.env.SMTP_IGNORE_TLS),
  });

  await transporter.sendMail({
    from: process.env.SMTP_USER!,
    to,
    html,
    subject,
  });
};
