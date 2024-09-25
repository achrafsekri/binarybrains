"use server";

import { render } from "@react-email/components";
import nodemailer from "nodemailer";

import { InvoiceEmail } from "../emails/invoice-email";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: process.env.EMAIL_SERVER_PORT,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export const sendInvoiceEmail = async (html: any, subject: string) => {
  const options = {
    from: process.env.EMAIL_FROM,
    to: "achrafsekri2001@gmail.com",
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
