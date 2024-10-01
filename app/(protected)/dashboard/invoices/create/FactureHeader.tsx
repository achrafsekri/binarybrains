import React from "react";
import { format } from "date-fns";

const FactureHeader = () => {
  const today = new Date();
  // 12 October, 2025
  const formattedDate = format(today, "dd MMMM, yyyy");
  return (
    <div>
      <h1 className="mb-2 text-4xl lg:text-5xl font-semibold text-gray-800">Facture</h1>
      <div className="flex flex-wrap items-center gap-2 text-xs lg:gap-4">
        <div className="rounded-full border-[1px] border-dashed border-gray-800 px-2 py-1">
          Facture° 0001
        </div>
        <div className="rounded-full border-[1px] border-dashed border-gray-800 px-2 py-1">
          {formattedDate}
        </div>
        <div className="rounded-full border-[1px] border-dashed border-gray-800 px-2 py-1">
          Échéance : 30 / 11 / 2035
        </div>
      </div>
      <hr className="my-4" />
    </div>
  );
};

export default FactureHeader;
