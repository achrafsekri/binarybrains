"use client";

import React, { useEffect, useState } from "react";
import { Visit } from "@prisma/client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/shared/DatePicker";

const months = [
  { value: "01", label: "Janvier" },
  { value: "02", label: "Février" },
  { value: "03", label: "Mars" },
  { value: "04", label: "Avril" },
  { value: "05", label: "Mai" },
  { value: "06", label: "Juin" },
  { value: "07", label: "Juillet" },
  { value: "08", label: "Août" },
  { value: "09", label: "Septembre" },
  { value: "10", label: "Octobre" },
  { value: "11", label: "Novembre" },
  { value: "12", label: "Décembre" },
];

const VisitsStats = ({ visits }: { visits: Visit[] }) => {
  const [month, setMonth] = useState<string>("01");
  const [shownVisits, setShownVisits] = useState<Visit[]>(visits);
  useEffect(() => {
    setShownVisits(
      visits.filter(
        (visit) => visit.createdAt.getMonth() + 1 === parseInt(month),
      ),
    );
  }, [month]);
  const currentMonth = new Date().getMonth() + 1;
  return (
    <>
      <h2 className="text-lg font-semibold">Statistiques</h2>
      <Select onValueChange={setMonth} defaultValue={currentMonth.toString()}>
        <SelectTrigger className="w-auto">
          <SelectValue placeholder="Sélectionner un mois" />
        </SelectTrigger>
        <SelectContent>
          {months.map((month, index) => (
            <SelectItem key={index} value={month.value}>
              {month.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="grid grid-cols-2 gap-4">
        <div className="overflow-hidden rounded-lg border p-4">
          <dt className="truncate text-sm font-medium text-gray-500">
            Visites
          </dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
            {shownVisits.length}
          </dd>
        </div>
        <div className="overflow-hidden rounded-lg border p-4">
          <dt className="truncate text-sm font-medium text-gray-500">
            Taux de visite
          </dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
            {shownVisits.length / 10}
          </dd>
        </div>
      </div>
    </>
  );
};

export default VisitsStats;
