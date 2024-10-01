import { useContext } from "react";

import { invoiceFormContext } from "./CreateInvoiceForm";

export default function PricingDetails() {
  const form = useContext(invoiceFormContext);
  form?.watch("Settings");
  form?.watch("ProductsList");
  const settings = form?.getValues("Settings");
  const Products = form?.getValues("ProductsList");
  const subTotal = Products?.reduce(
    (acc: number, product) =>
      acc + product.unitPrice * (settings?.showQuantity ? product.quantity : 1),
    0,
  );
  const vat = form?.getValues("Settings.vatActivated")
    ? form?.getValues("Settings.vatPerItem")
      ? (Products?.reduce(
          (acc, product) => acc + parseFloat(product.vatRate + "" || 0 + ""),
          0,
        ) || 0) / (Products?.length || 0)
      : form?.getValues("Settings.vatRate")
    : 0;
  const total = (subTotal || 0) + ((vat / 100) * (subTotal || 0) || 0);
  const devise = form?.getValues("Settings.devise");
  return (
    <div className="lg:mt-4 mt-0 flex justify-end">
      <div className="lg:w-1/3 w-1/2 text-xs md:text-base">
        <div className="flex justify-between border-b border-gray-200 py-2">
          <span className="font-medium text-gray-600">Subtotal</span>
          <span className="text-gray-800">
            {form?.getValues("Settings.showUnit") && (devise || "$")}
            {subTotal?.toLocaleString("en")}
          </span>
        </div>
        <div className="flex justify-between border-b border-gray-200 py-2">
          <span className="font-medium text-gray-600">
            VAT ({parseInt(`${vat}`)?.toFixed(2) || 0}%)
          </span>
          <span className="text-gray-800">
            {form?.getValues("Settings.showUnit") && (devise || "$")}
            {((vat / 100) * (subTotal || 0) || 0).toLocaleString("en")}
          </span>
        </div>
        <div className="flex justify-between py-2 font-bold">
          <span className="text-gray-800">Total</span>
          <span className="text-gray-800">
            {form?.getValues("Settings.showUnit") && (devise || "$")}
            {total.toLocaleString("en")}
          </span>
        </div>
      </div>
    </div>
  );
}
