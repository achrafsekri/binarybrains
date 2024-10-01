import React from "react";

const FactureHeader = () => {
  return (
    <div>
      <h1 className="mb-2 text-5xl font-semibold text-gray-800">Facture</h1>
      <div className="flex text-xs items-center gap-4">
        <div className="rounded-full border-[1px] border-gray-800 px-2 py-1">Facture° 0001</div>
        <div className="rounded-full border-[1px] border-gray-800 px-2 py-1">2021-10-10</div>
      </div>
      <hr className="my-4" />
    </div>
  );
};

export default FactureHeader;
