"use client";

import { useContext, useState } from "react";
import { Minus, Pencil, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FormField, FormItem } from "@/components/ui/form";
import EditSellerInfoModal from "@/components/modals/EditSellerInfoModal";

import { invoiceFormContext } from "./CreateInvoiceForm";

export default function SellerForm() {
  const [showEditModal, setShowEditModal] = useState(false);
  const form = useContext(invoiceFormContext);
  function adjustInputWidth(value: string, key: string) {
    const span = document.getElementById(`input-width-helper-${key}`);

    // Update the span content to the current input value
    span!.textContent = value || key; // Fallback to placeholder when empty

    // Calculate and set input width based on the span's width
    const input = span?.nextElementSibling;
    //@ts-ignore
    input!.style.width = `${span?.offsetWidth}px`;
  }
  form?.watch("SellerDetails");

  const sellerDetails: Record<string, any> = {
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

  const add = Object.keys(sellerDetails).filter(
    (key: string) => sellerDetails[key].value === null,
  );

  return (
    <div className="text-2xs relative flex flex-1 flex-col items-start border-2 border-dashed p-2 hover:bg-gray-100 lg:min-w-64 lg:flex-none lg:text-sm">
      <p className="font-semibold text-gray-600">
        {sellerDetails.name.value || "Nom du vendeur"}
      </p>
      {/* //siret */}
      <p className="text-gray-600">
        SIRET: {sellerDetails.siret.value || "000 000 000 00000"}{" "}
      </p>
      <p className="text-gray-600">
        {sellerDetails.address.value || "123 Company Street, City, Country"}
      </p>
      <p className="text-gray-600">
        {sellerDetails.phone.value || "+1 234 567 890"}
      </p>
      <p className="text-gray-600">
        {sellerDetails.email.value || "example@example.com"}
      </p>
      <button
        type="button"
        className="absolute right-2 top-2 rounded-full px-2 py-2 text-gray-600 hover:bg-primary hover:text-white"
        onClick={() => setShowEditModal(true)}
      >
        <Pencil size={16} className="" />
      </button>
      {showEditModal && (
        <EditSellerInfoModal
          showModal={showEditModal}
          setShowModal={setShowEditModal}
        />
      )}
    </div>
  );
}
