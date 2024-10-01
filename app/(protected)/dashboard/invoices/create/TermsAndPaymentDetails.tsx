import { Pencil } from "lucide-react";
import React from "react";

const TermsAndPaymentDetails = () => {
  return (
    <div className="relative my-8 border-2 border-dashed p-2 hover:bg-gray-100">
      <h2 className="mb-2 text-sm lg:text-base font-semibold">Reglement</h2>
      <div className="">
        <h3 className="mb-1 text-xs md:text-sm font-semibold">Par virement bancaire</h3>
        <div className="flex text-2xs md:text-xs flex-col space-y-0.5">
          <p >
            Veuillez effectuer le virement sur le compte suivant :
          </p>
          <p >
            <span className="font-semibold">IBAN :</span>
            FR76 3000 3032 0000 0200 1234 567
          </p>
          <p >
            <span className="font-semibold">BIC :</span> SOGEFRPP
          </p>
          <p >
            <span className="font-semibold">Nom de la banque :</span> Société
            Générale
          </p>
        </div>
        <p className="mt-2 text-2xs md:text-xs">
          En cas de retard de paiement, et conformément au code de commerce, une
          indemnité calculée à trois fois le taux d’intérêt légal ainsi qu’un
          frais de recouvrement de 40 euros sont exigibles.
        </p>
      </div>
      <button
        type="button"
        className="absolute right-2 top-2 rounded-full px-2 py-2 text-gray-600 hover:bg-primary hover:text-white"
        onClick={() => {}}
      >
        <Pencil size={16} className="" />
      </button>
    </div>
  );
};

export default TermsAndPaymentDetails;
