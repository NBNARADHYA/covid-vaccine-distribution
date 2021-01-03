import { createTransport } from "nodemailer";

export interface EmailProps {
  to: string;
  html: string;
  subject: string;
}

export const sendMail = async ({ to, html, subject }: EmailProps) => {
  const transporter = createTransport({
    service: "gmail",
    host: process.env.SMTP_HOST!,
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASS!,
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_USER!,
    to,
    html,
    subject,
  });
};
