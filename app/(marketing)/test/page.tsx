"use client";

import React from "react";
import { sendInvoiceEmail } from "@/actions/send-invoice-email";
import { InvoiceEmail } from "@/emails/invoice-email";
import { render } from "@react-email/components";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

const page = () => {
  const [loading, setLoading] = React.useState(false);

  const sendTestEmail = async () => {
    setLoading(true);
    const emailHtml = await render(
      <InvoiceEmail
        invoiceLink={"alloFacture.com"}
        senderName={"achraf"}
        receiverName={"malek"}
      />,
    );
    try {
      const response = await sendInvoiceEmail(
        emailHtml,
        "Vous avez une nouvelle facture",
      );
      console.log(response);
      toast.success("Email sent successfully");
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to send email");
      setLoading(false);
    }
  };
  return (
    <div>
      <Button onClick={sendTestEmail}>
        {loading ? "Sending..." : "Send Email"}
      </Button>
    </div>
  );
};

export default page;
