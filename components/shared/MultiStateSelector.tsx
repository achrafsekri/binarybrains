import React from "react";
import { State } from "@prisma/client";

import MultipleSelector, { Option } from "@/components/ui/multiple-selector";

const OPTIONS: Option[] = Object.values(State).map((state) => ({
  label: state,
  value: state,
}));

const MultipleStateSelector = ({
  onSelect,
}: {
  onSelect: (value: string[]) => void;
}) => {
  return (
    <div className="w-full">
      <MultipleSelector
        defaultOptions={OPTIONS}
        placeholder="Sélectionner les états"
        onSelect={onSelect}
        emptyIndicator={
          <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
            Aucun état sélectionné
          </p>
        }
      />
    </div>
  );
};

export default MultipleStateSelector;
