import { createTransport } from "nodemailer";

export interface EmailProps {
  email: string;
  html: string;
  subject: string;
}

const transporter = createTransport({
  host: process.env.SMTP_HOST!,
  port: +process.env.SMTP_PORT!,
  auth: {
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASS!,
  },
});

export const sendMail = async ({ email, html, subject }: EmailProps) => {
  await transporter.sendMail({
    from: process.env.SMTP_USER!,
    to: email,
    html,
    subject,
  });
};
