import { useContext, useState } from "react";
import { Minus, Pencil, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import EditClientInfoModal from "@/components/modals/EditClientInfoModal";
import AutoGrowTextArea from "@/components/shared/AutoGrowTextarea";

import { invoiceFormContext } from "./CreateInvoiceForm";

export default function ClientForm() {
  const [showEditModal, setShowEditModal] = useState(false);
  const form = useContext(invoiceFormContext);
  form?.watch("ClientDetails");
  const ClientDetails: Record<string, any> = {
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
    <div className="relative flex flex-1 flex-col items-start border-2 border-dashed p-2 text-2xs hover:bg-gray-100 lg:min-w-64 lg:flex-none lg:text-sm">
      <p className="font-semibold text-gray-600">À l’attention de:</p>
      <p className="font-medium text-gray-600">
        {ClientDetails.name.value || "Panorama"}
      </p>
      {/* //siret */}
      <p className="text-gray-600">
        SIRET: {ClientDetails.siret.value || "123456789"}{" "}
      </p>
      <p className="text-gray-600">
        {ClientDetails.phone.value || "123-456-7890"}
      </p>
      <p className="text-gray-600">
        {ClientDetails.email.value || "hello@Panorama.fr"}{" "}
      </p>
      <p className="text-gray-600">
        {ClientDetails.address.value || "1234 Paris, France"}
      </p>
      <button
        type="button"
        className="absolute right-2 top-2 rounded-full p-2 text-gray-600 hover:bg-primary hover:text-white"
        onClick={() => {
          setShowEditModal(true);
        }}
      >
        <Pencil size={16} className="" />
      </button>
      
      {showEditModal && (
        <EditClientInfoModal
          showModal={showEditModal}
          setShowModal={setShowEditModal}
        />
      )}
    </div>
  );
}
