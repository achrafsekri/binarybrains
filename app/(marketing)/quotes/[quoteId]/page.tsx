import React from "react";

import { QuoteWithRelations } from "@/types/quote-with-relations";
import { prisma } from "@/lib/db";

import QuoteContainer from "./QuoteContainer";

export const metadata = {
  title: "Devis | alloFacture",
  description: "Votre devis.",
};

const PDFPreview = async ({ params }: { params: { quoteId: string } }) => {
  const { quoteId } = params;
  const quote = await prisma.quote.findUnique({
    where: {
      id: quoteId,
    },
    include: {
      items: true,
      seller: true,
      customer: true,
    },
  });

  return (
    <div>
      <QuoteContainer quote={quote as QuoteWithRelations} />
    </div>
  );
};

export default PDFPreview;
