"use client";

import React from "react";
import InvoiceTemplateA from "@/pdf/InvoiceTemplateA";
import { BlobProvider, PDFDownloadLink, PDFViewer } from "@react-pdf/renderer"; // Your PDF component

const PDFPreview = () => {
  return (
    <div className="pdf-container">
      <div style={{ border: "1px solid #999", marginBottom: "20px" }}>
        <PDFViewer width="100%" height="1200px">
          <InvoiceTemplateA />
        </PDFViewer>
      </div>

      {/*       
      <div style={{ marginBottom: '20px' }}>
        <h3>Method 2: Download Link</h3>
        <PDFDownloadLink
          document={<InvoicePDF />}
          fileName="invoice.pdf"
          style={{
            padding: '10px 20px',
            background: '#007bff',
            color: '#fff',
            borderRadius: '4px',
            textDecoration: 'none'
          }}
        >
          {({ blob, url, loading, error }) =>
            loading ? 'Loading document...' : 'Download PDF'
          }
        </PDFDownloadLink>
      </div>

      
      <div>
        <h3>Method 3: Open in New Tab</h3>
        <BlobProvider document={<InvoicePDF />}>
          {({ blob, url, loading, error }) => {
            return (
              <button
                onClick={() => {
                  if (url) {
                    window.open(url, '_blank');
                  }
                }}
                style={{
                  padding: '10px 20px',
                  background: '#28a745',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
                disabled={loading || !!error}
              >
                {loading ? 'Loading...' : 'Open in New Tab'}
              </button>
            );
          }}
        </BlobProvider>
      </div> */}
    </div>
  );
};

export default PDFPreview;
