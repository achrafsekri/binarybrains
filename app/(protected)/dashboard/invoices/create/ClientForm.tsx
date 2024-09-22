import { useContext } from "react";
import { Minus, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";

import { invoiceFormContext } from "./page";
import AutoGrowTextArea from "@/components/shared/AutoGrowTextarea";

export default function ClientForm() {
  const form = useContext(invoiceFormContext);
  form?.watch("ClientDetails");
  const ClientDetails = {
    name: {
      label: "Client Name:",
      value: form?.getValues("ClientDetails.name"),
      nullable: false, // Not nullable, as per schema
    },
    address: {
      label: "Address:",
      value: form?.getValues("ClientDetails.address"),
      nullable: false, // Not nullable, as per schema
    },
    siret: {
      label: "SIRET:",
      value: form?.getValues("ClientDetails.siret"),
      nullable: true, // Nullable, as per schema
    },
    phone: {
      label: "Contact:",
      value: form?.getValues("ClientDetails.phone"),
      nullable: true, // Nullable, as per schema
    },
    email: {
      label: "Email:",
      value: form?.getValues("ClientDetails.email"),
      nullable: true, // Nullable, as per schema
    },
  };
  const add = Object.keys(ClientDetails).filter(
    (key) => ClientDetails[key].value === null,
  );
  return (
    <div className="mb-8 rounded-lg bg-gray-50 p-4">
      <h2 className="mb-2 text-xl font-semibold text-gray-800">
        Client Details
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {Object.keys(ClientDetails).map(
          (key) =>
            ClientDetails[key].value && (
              <FormField
                key={key}
                control={form?.control}
                //@ts-ignore
                name={`ClientDetails.${key}`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-gray-700">
                      {ClientDetails[key].label}
                    </FormLabel>
                    <div className="group flex w-full gap-1 items-center">
                      <Button
                        onClick={() => field.onChange(null)}
                        variant={"ghost"}
                        className={cn(
                          "invisible size-fit justify-end border-none p-1 text-primary hover:bg-transparent hover:text-primary",
                          ClientDetails[key].nullable && "group-hover:visible",
                        )}
                      >
                        <Minus className="size-4" />
                      </Button>
                      <AutoGrowTextArea
                        placeholder={key}
                        Value={field.value as string}
                        onChange={field.onChange}
                        className="w-full text-gray-600 h-max border-none"
                      />
                    </div>
                  </FormItem>
                )}
              />
            ),
        )}
        <div className="group flex w-full justify-center">
          <Button
            variant={"ghost"}
            //@ts-ignore
            onClick={() => form?.resetField(`ClientDetails.${add[0]}`)}
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
