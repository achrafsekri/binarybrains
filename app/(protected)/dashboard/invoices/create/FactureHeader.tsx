import React, { useContext, useState } from "react";
import { format } from "date-fns";

import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/shared/DatePicker";

import { invoiceFormContext } from "./CreateInvoiceForm";

const FactureHeader = () => {
  const [IdFocus, setIdFocus] = useState(false);
  const form = useContext(invoiceFormContext);
  const invoiceDetails = form?.getValues("InvoiceDetails");
  form?.watch("InvoiceDetails");
  return (
    <div>
      <h1 className="mb-2 text-4xl font-semibold text-gray-800 lg:text-5xl">
        Facture
      </h1>
      <div className="flex flex-wrap items-center gap-2 text-xs lg:gap-4">
        {!IdFocus ? (
          <div
            onDoubleClick={() => setIdFocus(true)}
            className="rounded-full border border-dashed border-gray-800 px-2 py-1"
          >
            Facture° {invoiceDetails?.invoiceNumber}
          </div>
        ) : (
          <Input
            autoFocus
            onBlur={() => setIdFocus(false)}
            className="size-fit rounded-full border border-dashed border-gray-800 px-2 py-1 text-[10px]"
            value={invoiceDetails?.invoiceNumber}
            onKeyDown={(e) => e.key === "Enter" && setIdFocus(false)}
            onChange={(e) =>
              form?.setValue("InvoiceDetails.invoiceNumber", e.target.value)
            }
          />
        )}
        <DatePicker
          className="size-fit rounded-full border border-dashed border-gray-800 px-2 py-1 text-xs"
          date={invoiceDetails?.startingDate as Date}
          setDate={(date) =>
            form?.setValue("InvoiceDetails.startingDate", date as Date)
          }
        />
        <DatePicker
          className="size-fit rounded-full border border-dashed border-gray-800 px-2 py-1 text-xs"
          date={invoiceDetails?.dueDate as Date}
          setDate={(date) =>
            form?.setValue("InvoiceDetails.dueDate", date as Date)
          }
          prefix="Échéance"
        />
      </div>
      <hr className="my-4" />
    </div>
  );
};

export default FactureHeader;
