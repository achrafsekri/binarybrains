"use client";


import ClientForm from "./ClientForm";
import PricingDetails from "./PricingDetails";
import ProductsTable from "./ProductsTable";
import SellerForm from "./SellerForm";

export default function InvoiceInterface() {
  return (
    <div className="col-span-2 mx-auto max-w-4xl rounded-xl border bg-white p-8 shadow-md">
      <div className="mb-8 flex items-start justify-between">
        <SellerForm />
        <div className="text-right">
          <h2 className="font-gray-800 mb-2 text-xl font-semibold">
            Invoice #INV-001
          </h2>
          <p className="font-gray-600 text-sm">Created: May 1, 2023</p>
          <p className="font-gray-600 text-sm">Delivered: May 5, 2023</p>
          <p className="font-gray-600 text-sm">Due: May 15, 2023</p>
        </div>
      </div>
      <ClientForm />
      <ProductsTable />
      <PricingDetails />
      
    </div>
  );
}
