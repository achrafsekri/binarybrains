"use server";

import nodemailer from "nodemailer";

import { logger } from "@/lib/logger";

const transporter = nodemailer.createTransport({
  // @ts-expect-error
  host: process.env.EMAIL_SERVER_HOST,
  port: process.env.EMAIL_SERVER_PORT,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export const sendEmail = async (html: any, subject: string, to: string) => {
  const options = {
    from: `"Sotacib" <${process.env.EMAIL_FROM}>`,
    to: to,
    subject: subject,
    html: html,
  };
  try {
    return await transporter.sendMail(options);
  } catch (error) {
    //@ts-ignore
    logger.error("Failed to send email", error);
    return { ok: false, msg: "Failed to send email" };
  }
};
