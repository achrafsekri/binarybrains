"use client";

import React from "react";
import InvoiceTemplateA from "@/pdf/InvoiceTemplateA";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer"; // Your PDF component

import { InvoiceWithRelations } from "@/types/invoice-with-relations";
import { Button } from "@/components/ui/button";

const InvoiceContainer = ({ invoice }: { invoice: InvoiceWithRelations }) => {
  return (
    <div style={{ border: "1px solid #999", marginBottom: "20px" }}>
      <div className="lg:hidden flex items-center justify-end">
        <PDFDownloadLink
          document={<InvoiceTemplateA invoice={invoice} />}
          fileName={`facture-${invoice.number}.pdf`}
        >
          <Button>Télécharger la facture</Button>
        </PDFDownloadLink>
      </div>
      <PDFViewer width="100%" height="1200px">
        <InvoiceTemplateA invoice={invoice} />
      </PDFViewer>
    </div>
  );
};

export default InvoiceContainer;
