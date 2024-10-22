import { useContext, useEffect } from "react";

import { invoiceFormContext } from "./CreateInvoiceForm";

export default function PricingDetails() {
  const form = useContext(invoiceFormContext);
  form?.watch("Settings");
  form?.watch("ProductsList");
  const settings = form?.getValues("Settings");
  const Products = form?.getValues("ProductsList");
  const vatActivated = settings?.vatActivated;

  console.log("vatActivated", vatActivated);

  const subTotal = Products?.reduce(
    (acc: number, product) =>
      acc +
      parseFloat(product.unitPrice) *
        (settings?.showQuantity ? parseInt(product.quantity) : 1),
    0,
  );
  const vat = vatActivated
    ? form?.getValues("Settings.vatPerItem")
      ? (Products?.reduce(
          (acc, product) => acc + parseFloat(product.vatRate + "" || 0 + ""),
          0,
        ) || 0) / (Products?.length || 0) || 0
      : form?.getValues("Settings.vatRate") || 0
    : 0;
  const total = vatActivated
    ? (subTotal || 0) + ((vat / 100) * (subTotal || 0) || 0)
    : subTotal;
  const devise = form?.getValues("Settings.devise");
  useEffect(() => {
    form?.setValue("InvoiceDetails.subtotal", subTotal ?? 0);
    form?.setValue("InvoiceDetails.vatRate", vat);
    form?.setValue("InvoiceDetails.vatAmount", (vat / 100) * (subTotal || 0));
    form?.setValue(
      "InvoiceDetails.total",
      vatActivated ? (total ?? 0) : (subTotal ?? 0),
    );
  }, [Products, vatActivated]);
  return (
    <div className="mt-0 flex justify-end lg:mt-4">
      <div className="w-1/2 text-xs md:text-base lg:w-1/3">
        <div className="flex justify-between border-b border-gray-200 py-2">
          <span className="font-medium text-gray-600">Total HT</span>
          <span className="text-gray-800">
            {form?.getValues("Settings.showUnit") && (devise || "$")}
            {subTotal?.toLocaleString("en")}
          </span>
        </div>
        <div className="flex justify-between border-b border-gray-200 py-2">
          <span className="font-medium text-gray-600">
            TVA ({parseInt(`${vat}`)?.toFixed(2) || 0}%)
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
            {total?.toLocaleString("en")}
          </span>
        </div>
      </div>
    </div>
  );
}
