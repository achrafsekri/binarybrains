"use client";

import ClientForm from "./ClientForm";
import InvoiceDetails from "./InvoiceDetails";
import PricingDetails from "./PricingDetails";
import ProductsTable from "./ProductsTable";
import SellerForm from "./SellerForm";

export default function InvoiceInterface() {
  return (
    <div className="col-span-2 mx-auto max-w-4xl rounded-xl border bg-white p-8 shadow-md">
      <div className="mb-8 flex items-start justify-between">
        <SellerForm />
        <InvoiceDetails />
      </div>
      <ClientForm />
      <ProductsTable />
      <PricingDetails />
    </div>
  );
}
