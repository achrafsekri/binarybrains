"use client";

import React from "react";
import { ReminderEmail } from "@/emails/reminder-email";
import { render } from "@react-email/components";
import { toast } from "sonner";
import { sendEmail } from "@/actions/send-email.server";

import { Button } from "@/components/ui/button";

const page = () => {
  const [loading, setLoading] = React.useState(false);

  const sendTestEmail = async () => {
    setLoading(true);
    const emailHtml = await render(
      <ReminderEmail
        documentLink={"alloFacture.com"}
        senderName={"achraf"}
        receiverName={"malek"}
        type={"DEVIS"}
        dueDate="2022-01-01"
        amount="1000"
      />,
    );
    try {
       await sendEmail(
        emailHtml,
        "Vous avez une facture en attente",
        "achrafsekri2001@gmail.com"
      );
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
