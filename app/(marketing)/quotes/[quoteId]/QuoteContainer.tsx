"use client";

import React from "react";
import QuoteTemplateA from "@/pdf/QuoteTemplateA";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer"; // Your PDF component

import { QuoteWithRelations } from "@/types/quote-with-relations";
import { Button } from "@/components/ui/button";

const QuoteContainer = ({ quote }: { quote: QuoteWithRelations }) => {
  return (
    <div style={{ border: "1px solid #999", marginBottom: "20px" }}>
      <div className="flex items-center justify-end lg:hidden">
        <PDFDownloadLink
          document={<QuoteTemplateA quote={quote} />}
          fileName={`devis-${quote.number}.pdf`}
        >
          <Button>Télécharger le devis</Button>
        </PDFDownloadLink>
      </div>
      <PDFViewer width="100%" height="1200px">
        <QuoteTemplateA quote={quote} />
      </PDFViewer>
    </div>
  );
};

export default QuoteContainer;
