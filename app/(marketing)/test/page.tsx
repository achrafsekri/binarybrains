"use client";

import React from "react";
import { sendInvoiceEmail } from "@/actions/send-invoice-email";
import { InvoiceEmail } from "@/emails/invoice-email";
import { render } from "@react-email/components";
import { toast } from "sonner";

const page = async () => {
  const emailHtml = await render(
    <InvoiceEmail
      invoiceLink={"alloFacture.com"}
      senderName={"achraf"}
      receiverName={"malek"}
    />,
  );
  const send = async () => {
    try {
      const response = await sendInvoiceEmail(emailHtml, "Vous avez une nouvelle facture");
      console.log(response);
      toast.success("Email sent successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to send email");
    }
  };
  return (
    <div>
      <button onClick={send}>Send Email</button>
    </div>
  );
};

export default page;
