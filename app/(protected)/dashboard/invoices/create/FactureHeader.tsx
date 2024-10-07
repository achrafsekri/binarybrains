import React, { useContext, useEffect, useState } from "react";
import { toast } from "sonner";

import { logger } from "@/lib/logger";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/shared/DatePicker";
import { InvoiceFileUploader } from "@/components/shared/invoice-file-uploader";

import { invoiceFormContext } from "./CreateInvoiceForm";

const FactureHeader = () => {
  const [IdFocus, setIdFocus] = useState(false);
  const [preview, setPreview] = useState<File | null>(null);
  const form = useContext(invoiceFormContext);
  const invoiceDetails = form?.getValues("InvoiceDetails");
  form?.watch("InvoiceDetails");

  const onUpload = async (files: File[]) => {
    const file = files[0];
    const reader = new FileReader();

    reader.onload = async (event) => {
      const fileData = event.target?.result;

      if (fileData) {
        try {
          const presignedURL = new URL("/api/presigned", window.location.href);
          presignedURL.searchParams.set("fileName", file.name);
          presignedURL.searchParams.set("contentType", file.type);

          const res = await fetch(presignedURL.toString());
          const { signedUrl } = await res.json();

          const body = new Blob([fileData], { type: file.type });

          await fetch(signedUrl, {
            body,
            method: "PUT",
          });
          form?.setValue("SellerDetails.logo", signedUrl.split("?")[0]);
          toast.success("L'upload de votre logo a réussi");
        } catch (error) {
          console.error("Upload failed for file:", file.name, error);

          toast.error("L'upload a échoué");
        }
      } else {
        logger.error("Failed to read file data");
        toast.error("L'upload a échoué");
      }
    };

    reader.onerror = (error) => toast.error("L'upload a échoué");
    reader.readAsArrayBuffer(file);
  };
  return (
    <div className="relative">
      <div className="absolute right-0 top-0 z-10">
        {
          <InvoiceFileUploader
            onUpload={onUpload}
            defvalue={form?.getValues("SellerDetails.logo") as string}
          />
        }
      </div>
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
