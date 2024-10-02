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
    <div className="mx-auto max-w-full rounded-xl border bg-white p-4 md:p-8 shadow-md lg:col-span-2 lg:max-w-4xl">
      <FactureHeader />

      <div className="lg:mb-16 mb-8 gap-2 flex items-start justify-between">
        <SellerForm />
      <ClientForm />
        {/* <InvoiceDetails /> */}
      </div>
      <ProductsTable />
      <PricingDetails />
      <TermsAndPaymentDetails />
    </div>
  );
}
