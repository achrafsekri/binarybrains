import React from "react";

import { InvoiceWithRelations } from "@/types/invoice-with-relations";
import { prisma } from "@/lib/db";

import InvoiceContainer from "./InvoiceContainer";

export const metadata = {
  title: "Facture | alloFacture",
  description: "Votre facture.",
};

const PDFPreview = async ({ params }: { params: { invoiceId: string } }) => {
  const { invoiceId } = params;
  const invoice = await prisma.invoice.findUnique({
    where: {
      id: invoiceId,
    },
    include: {
      items: true,
      seller: true,
      customer: true,
    },
  });

  return (
    <div>
      <InvoiceContainer invoice={invoice as InvoiceWithRelations} />
    </div>
  );
};

export default PDFPreview;
