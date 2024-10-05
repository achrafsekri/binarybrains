"use client";

import React from "react";
import InvoiceTemplateA from "@/pdf/InvoiceTemplateA";
import { BlobProvider, PDFDownloadLink, PDFViewer } from "@react-pdf/renderer"; // Your PDF component

import { InvoiceWithRelations } from "@/types/invoice-with-relations";

const InvoiceContainer = ({ invoice }: { invoice: InvoiceWithRelations }) => {
  return (
    <div style={{ border: "1px solid #999", marginBottom: "20px" }}>
      <PDFViewer width="100%" height="1200px">
        <InvoiceTemplateA invoice={invoice} />
      </PDFViewer>
    </div>
  );
};

export default InvoiceContainer;
