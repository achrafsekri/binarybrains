"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { State } from "@prisma/client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const StatesFilter = ({ states }: { states: State[] }) => {
  const router = useRouter();
  return (
    <>
      <Select
        onValueChange={(value) =>
          value === "all"
            ? router.push("/dashboard/points-de-vente")
            : router.push(`/dashboard/points-de-vente?state=${value}`)
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
