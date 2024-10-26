"use client";

import React from "react";
import QuoteTemplateA from "@/pdf/QuoteTemplateA";
import { PDFViewer } from "@react-pdf/renderer"; // Your PDF component

import { QuoteWithRelations } from "@/types/quote-with-relations";

const QuoteContainer = ({ quote }: { quote: QuoteWithRelations }) => {
  return (
    <div style={{ border: "1px solid #999", marginBottom: "20px" }}>
      <PDFViewer width="100%" height="1200px">
        <QuoteTemplateA quote={quote} />
      </PDFViewer>
    </div>
  );
};

export default QuoteContainer;
