"use client";

import ClientForm from "./ClientForm";
import FactureHeader from "./FactureHeader";
import InvoiceDetails from "./InvoiceDetails";
import PricingDetails from "./PricingDetails";
import ProductsTable from "./ProductsTable";
import SellerForm from "./SellerForm";
import TermsAndPaymentDetails from "./TermsAndPaymentDetails";

export default function InvoiceInterface() {
  return (
    <div className="mx-auto max-w-full rounded-xl border bg-white p-8 shadow-md lg:col-span-2 lg:max-w-4xl">
      <FactureHeader />

      <div className="mb-16 flex items-start justify-between">
        <SellerForm />
        <InvoiceDetails />
      </div>
      {/* <ClientForm /> */}
      <ProductsTable />
      <PricingDetails />
      <TermsAndPaymentDetails />
    </div>
  );
}
