import { useContext } from "react";
import { Minus , Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { invoiceFormContext } from "./CreateQuoteForm";
import { FileUploader } from "@/components/shared/file-uploader";
import { InvoiceFileUploader } from "@/components/shared/invoice-file-uploader";

export default function SellerForm() {
  const form = useContext(invoiceFormContext);
  function adjustInputWidth(value, key) {
    const span = document.getElementById(`input-width-helper-${key}`);

    // Update the span content to the current input value
    span!.textContent = value || key; // Fallback to placeholder when empty

    // Calculate and set input width based on the span's width
    const input = span?.nextElementSibling;
    //@ts-ignore
    input!.style.width = `${span?.offsetWidth}px`;
  }
  form?.watch("SellerDetails");
  const sellerDetails = {
    name: {
      value: form?.getValues("SellerDetails.name"),
      nullable: false, // Not nullable, as per schema
      tag: "h1", // Use h1 for name
    },
    address: {
      value: form?.getValues("SellerDetails.address"),
      nullable: false, // Not nullable, as per schema
      tag: "p", // Use p for address
    },
    logo: {
      value: form?.getValues("SellerDetails.logo"),
      nullable: true, // Nullable, as per schema
      tag: "p", // Use p for logo, if necessary
    },
    phone: {
      value: form?.getValues("SellerDetails.phone"),
      nullable: true, // Nullable, as per schema
      tag: "p", // Use p for phone
    },
    email: {
      value: form?.getValues("SellerDetails.email"),
      nullable: true, // Nullable, as per schema
      tag: "p", // Use p for email
    },
    siret: {
      value: form?.getValues("SellerDetails.siret"),
      nullable: true, // Nullable, as per schema
      tag: "p", // Use p for siret
    },
    vatNumber: {
      value: form?.getValues("SellerDetails.vatNumber"),
      nullable: true, // Nullable, as per schema
      tag: "p", // Use p for VAT number
    },
  };

  const add = Object.keys(sellerDetails).filter((key) => sellerDetails[key].value === null);

  return (
    <div className="flex flex-col items-center space-x-4">
      <div className=" w-full items-center justify-start relative">
        <InvoiceFileUploader/>
      </div>
      <div className="flex flex-col space-y-1">
        {Object.keys(sellerDetails).map(
          (key) =>
            sellerDetails[key].value && (
              <FormField
                //@ts-ignore
                name={`SellerDetails.${key}`}
                key={key}
                control={form?.control}
                render={({ field }) => (
                  <FormItem className="font-gray-600 group flex items-end justify-start gap-1 text-center text-sm">
                    <span>{sellerDetails[key]?.nullable && `${key}:`}</span>
                    <div className="relative">
                      {/* Invisible span to measure text width */}
                      <span
                        id={`input-width-helper-${key}`}
                        className="invisible absolute whitespace-pre font-bold"
                      >
                        {(field.value as string) || key}{" "}
                        {/* Fallback to placeholder value */}
                      </span>

                      <input
                        className={cn(
                          "size-fit min-w-max justify-start border-none p-0 text-sm text-gray-600 hover:bg-transparent",
                          sellerDetails[key].tag === "h1" &&
                            "text-2xl font-bold text-gray-800",
                        )}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          adjustInputWidth(e.target.value, key);
                        }}
                        value={field.value as string}
                        placeholder={key}
                        style={{ width: "auto" }} // To allow dynamic width change
                      />
                    </div>

                    <Button
                      onClick={() => field.onChange(null)}
                      variant={"ghost"}
                      className={cn(
                        "invisible size-fit justify-start border-none p-1 text-primary hover:bg-transparent hover:text-primary group-hover:visible",
                        !sellerDetails[key].nullable &&
                          "obacity-0 disabled:cursor-default disabled:opacity-0",
                      )}
                      disabled={!sellerDetails[key].nullable}
                    >
                      <Minus className="size-4" />
                    </Button>
                  </FormItem>
                )}
              />
            ),
        )}
        <div className="flex w-full justify-center group">
        <Button
          variant={"ghost"}
          //@ts-ignore
          onClick={()=>form?.resetField(`SellerDetails.${add[0]}`)}
          className={cn(
            "invisible size-fit rounded-full p-2 text-primary hover:text-primary",
            add.length > 0 && "group-hover:visible",
          )}
        >
          <Plus className="size-4" />
        </Button>
      </div>
      
      </div>
    </div>
  );
}
