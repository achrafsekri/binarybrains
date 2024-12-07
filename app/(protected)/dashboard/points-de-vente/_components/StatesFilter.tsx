"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { State } from "@prisma/client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { getStates } from "../get-states.server";

const StatesFilter = ({
  selectedState,
  setSelectedState,
}: {
  selectedState: State | null | "all";
  setSelectedState: (state: State | null | "all") => void;
}) => {
  const [states, setStates] = useState<State[]>([]);
  const router = useRouter();
  useEffect(() => {
    const fetchStates = async () => {
      const states = await getStates();
      setStates(states);
    };
    fetchStates();
  }, []);
  return (
    <>
      <Select
        value={selectedState || "all"}
        onValueChange={(value) =>
          setSelectedState(value === "all" ? null : (value as State))
        }
      >
        <SelectTrigger className="mb-4 w-full">
          <SelectValue placeholder="Sélectionner un état" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les états</SelectItem>
          {states.map((state) => (
            <SelectItem key={state} value={state}>
              {state}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
};

export default StatesFilter;
