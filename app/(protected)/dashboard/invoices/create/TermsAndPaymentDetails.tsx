import React, { useContext, useState } from "react";
import { Pencil } from "lucide-react";

import TermsAndPaymentModal from "@/components/modals/TermsAndPaymentModal";

import { invoiceFormContext } from "./CreateInvoiceForm";

const TermsAndPaymentDetails = () => {
  const [showEditModal, setShowEditModal] = useState(false);
  const form = useContext(invoiceFormContext);
  const invoiceDetails = form?.getValues("InvoiceDetails");
  form?.watch("InvoiceDetails");
  return (
    <div className="relative my-8 border-2 border-dashed p-2 hover:bg-gray-100">
      <h2 className="mb-2 text-sm font-semibold lg:text-base">Reglement</h2>
      {!invoiceDetails?.paymentTerms &&
      !invoiceDetails?.paymentDetails &&
      !invoiceDetails?.legalMentions ? (
        <div className="">
          <h3 className="mb-1 text-xs font-semibold md:text-sm">
            Par virement bancaire
          </h3>
          <div className="flex flex-col space-y-0.5 text-2xs md:text-xs">
            <p>Veuillez effectuer le virement sur le compte suivant :</p>
            <p>
              <span className="font-semibold">IBAN :</span>
              FR76 3000 3032 0000 0200 1234 567
            </p>
            <p>
              <span className="font-semibold">BIC :</span> SOGEFRPP
            </p>
            <p>
              <span className="font-semibold">Nom de la banque :</span> Société
              Générale
            </p>
          </div>
          <p className="mt-2 text-2xs md:text-xs">
            En cas de retard de paiement, et conformément au code de commerce,
            une indemnité calculée à trois fois le taux d’intérêt légal ainsi
            qu’un frais de recouvrement de 40 euros sont exigibles.
          </p>
        </div>
      ) : (
        <div>
          <h3 className="mb-1 text-xs font-semibold md:text-sm">
            {invoiceDetails?.paymentTerms}{" "}
          </h3>
          {invoiceDetails?.paymentDetails && (
            <div className="flex flex-col space-y-0.5 text-2xs md:text-xs">
              <p>Veuillez effectuer le virement sur le compte suivant :</p>
              {invoiceDetails?.paymentDetails
                ?.split("%n%")
                .map((chunk, index) => <p key={index}>{chunk}</p>)}
            </div>
          )}
          <p className="mt-2 text-2xs md:text-xs">
            {invoiceDetails?.legalMentions}{" "}
          </p>
        </div>
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
        <TermsAndPaymentModal
          setShowModal={setShowEditModal}
          showModal={showEditModal}
        />
      )}
    </div>
  );
};

export default TermsAndPaymentDetails;
