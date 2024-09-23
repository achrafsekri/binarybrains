import { useContext } from "react";
import { Minus, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { DatePicker } from "@/components/shared/DatePicker";

import { invoiceFormContext } from "./page";

export default function InvoiceDetails() {
  const form = useContext(invoiceFormContext);
  form?.watch("InvoiceDetails");
  const dates = {
    startingDate: {
      label: "Crée-le:",
      value: form?.getValues("InvoiceDetails.startingDate"), // Default invoice creation date
    },
    deliveryDate: {
      label: "Delivery:",
      value: form?.getValues("InvoiceDetails.deliveryDate"), // Default delivery date
    },
    dueDate: {
      label: "échéance:",
      value: form?.getValues("InvoiceDetails.dueDate"), // Default due date
    },
  };
  const add = Object.keys(dates).filter((key) => dates[key].value === null);
  
  return (
    <div className="text-right">
      <h2 className="font-gray-800 mb-2 text-xl font-semibold">
        #INV-001
      </h2>
      {Object.keys(dates).map(
        (key) =>
          dates[key].value && (
            <FormField
              //@ts-ignore
              name={`InvoiceDetails.${key}`}
              key={key}
              control={form?.control}
              render={({ field }) => (
                <FormItem className="font-gray-600 group flex items-end justify-start gap-1 text-sm text-center">
                  <Button
                    onClick={() => field.onChange(null)}
                    variant={"ghost"}
                    className="invisible size-fit justify-end border-none p-1 hover:bg-transparent group-hover:visible text-primary hover:text-primary"
                  >
                    <Minus className="size-4" />
                  </Button>
                  <span>{dates[key].label}</span>
                  <DatePicker
                    date={field.value as Date}
                    setDate={field.onChange}
                    className="size-fit justify-end border-none p-0 hover:bg-transparent"
                  />
                </FormItem>
              )}
            />
          ),
      )}
      <div className="flex w-full justify-center group">
        <Button
          variant={"ghost"}
          //@ts-ignore
          onClick={()=>form?.resetField(`InvoiceDetails.${add[0]}`)}
          className={cn(
            "invisible size-fit rounded-full p-2 text-primary hover:text-primary",
            add.length > 0 && "group-hover:visible",
          )}
        >
          <Plus className="size-4" />
        </Button>
      </div>
    </div>
  );
}
