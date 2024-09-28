"use server";

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: process.env.EMAIL_SERVER_PORT,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export const sendEmail = async (html: any, subject: string, to: string) => {
  const options = {
    from: `"AlloFacture" <${process.env.EMAIL_FROM}>`,
    to: to,
    subject: subject,
    html: html,
  };
  try {
    return await transporter.sendMail(options);
  } catch (error) {
    console.log("ERROR", error.message);
    return { ok: false, msg: "Failed to send email" };
  }
};
