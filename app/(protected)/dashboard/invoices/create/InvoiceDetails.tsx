import { useContext } from "react";
import { Minus, Pencil, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { DatePicker } from "@/components/shared/DatePicker";

import { invoiceFormContext } from "./CreateInvoiceForm";

export default function InvoiceDetails() {
  const form = useContext(invoiceFormContext);
  form?.watch("InvoiceDetails");
  const dates: Record<string, any> = {
    startingDate: {
      label: "Created:",
      value: form?.getValues("InvoiceDetails.startingDate"), // Default invoice creation date
    },
    deliveryDate: {
      label: "Delivery:",
      value: form?.getValues("InvoiceDetails.deliveryDate"), // Default delivery date
    },
    dueDate: {
      label: "Due:",
      value: form?.getValues("InvoiceDetails.dueDate"), // Default due date
    },
  };
  const add = Object.keys(dates).filter((key) => dates[key].value === null);
  return (
    <div className="relative min-w-64 flex flex-col items-start border-2 border-dashed p-2 hover:bg-gray-100">
      <p className="text-sm font-semibold text-gray-600">À l’attention de:</p>
      <p className="text-sm font-medium text-gray-600">Panorama</p>
      {/* //siret */}
      <p className="text-sm text-gray-600">SIRET: 123456789 </p>
      <p className="text-sm text-gray-600">123-456-7890</p>
      <p className="text-sm text-gray-600">hello@Panorama.fr </p>
      <p className="text-sm text-gray-600">1234 Paris, France</p>
      <button
        type="button"
        className="absolute right-2 top-2 rounded-full px-2 py-2 text-gray-600 hover:bg-primary hover:text-white"
        onClick={() => {}}
      >
        <Pencil size={16} className="" />
      </button>
    </div>
  );
}
