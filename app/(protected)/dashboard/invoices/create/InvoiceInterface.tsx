"use client";

import ClientForm from "./ClientForm";
import FactureHeader from "./FactureHeader";
import PricingDetails from "./PricingDetails";
import ProductsTable from "./ProductsTable";
import SellerForm from "./SellerForm";
import TermsAndPaymentDetails from "./TermsAndPaymentDetails";

export default function InvoiceInterface() {
  return (
    <div className="mx-auto max-w-full rounded-xl border bg-white p-4 shadow-md md:p-8 lg:col-span-2 lg:max-w-4xl">
      <FactureHeader />

      <div className="mb-8 flex items-start justify-between gap-2 lg:mb-16">
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
