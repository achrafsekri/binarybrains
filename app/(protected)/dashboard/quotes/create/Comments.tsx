import React, { useContext, useState } from "react";
import { Pencil } from "lucide-react";

import CommentsModal from "@/components/modals/CommentsModal";

import { devisFormContext } from "./CreateDevisForm";

const Comments = () => {
  const [showEditModal, setShowEditModal] = useState(false);
  const form = useContext(devisFormContext);
  const devisDetails = form?.getValues("DevisDetails");
  form?.watch("DevisDetails");
  return (
    <div className="relative my-8 border-2 border-dashed p-2 hover:bg-gray-100">
      <h2 className="mb-2 text-sm font-semibold lg:text-base">Reglement</h2>
      {!devisDetails?.comment && (
        <p className="mt-2 text-xs text-gray-500 md:text-sm">
          Aucune condition de paiement renseignée
        </p>
      )}
      {devisDetails?.comment && (
        <p className="mt-2 text-xs md:text-sm">{devisDetails?.comment}</p>
      )}
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
        <CommentsModal
          setShowModal={setShowEditModal}
          showModal={showEditModal}
        />
      )}
    </div>
  );
};

export default Comments;
