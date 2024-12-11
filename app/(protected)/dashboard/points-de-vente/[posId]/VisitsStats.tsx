"use client";

import React, { useEffect, useState } from "react";
import { getProductDisponibilityByPos } from "@/utils/stats/getProductDisponibilityByPos";
import { Product, Visit } from "@prisma/client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/shared/DatePicker";

import { VisitWithDisponibilities } from "../../visits/page";

const months = [
  { value: "00", label: "Janvier" },
  { value: "01", label: "Février" },
  { value: "02", label: "Mars" },
  { value: "03", label: "Avril" },
  { value: "04", label: "Mai" },
  { value: "05", label: "Juin" },
  { value: "06", label: "Juillet" },
  { value: "07", label: "Août" },
  { value: "08", label: "Septembre" },
  { value: "09", label: "Octobre" },
  { value: "10", label: "Novembre" },
  { value: "11", label: "Décembre" },
];

const VisitsStats = ({
  visits,
  posId,
}: {
  visits: VisitWithDisponibilities[];
  posId: string;
}) => {
  const [month, setMonth] = useState<string>(new Date().getMonth().toString());
  const [year, setYear] = useState<string>(new Date().getFullYear().toString());
  const [productDisponibilities, setProductDisponibilities] = useState<{
    score: string;
    disponibilities: {
      productId: string;
      productName: string;
      disponibility: number;
      available: boolean;
    }[];
  } | null>(null);
  const [shownVisits, setShownVisits] =
    useState<VisitWithDisponibilities[]>(visits);
  useEffect(() => {
    setShownVisits(
      visits.filter(
        (visit) =>
          visit.createdAt.getMonth() === parseInt(month) &&
          visit.createdAt.getFullYear() === parseInt(year),
      ),
    );
  }, [month, year]);

  useEffect(() => {
    getProductDisponibilityByPos(posId, new Date(), new Date()).then(
      (disponibilities) => {
        setProductDisponibilities(disponibilities);
      },
    );
  }, []);

  return (
    <>
      <h2 className="text-lg font-semibold">Statistiques</h2>
      <div className="grid w-full grid-cols-2 gap-4">
        <Select
          onValueChange={setYear}
          defaultValue={new Date().getFullYear().toString()}
        >
          <SelectTrigger className="w-auto">
            <SelectValue placeholder="Sélectionner une année" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 50 }, (_, i) => (
              <SelectItem
                key={i}
                value={(new Date().getFullYear() - i).toString()}
              >
                {(new Date().getFullYear() - i).toString()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          onValueChange={setMonth}
          defaultValue={new Date().getMonth().toString()}
        >
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
      </div>
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
            Disponibilité de nos produits
          </dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
            {productDisponibilities?.score}
          </dd>
        </div>
      </div>
      <div className="overflow-hidden rounded-lg p-4">
        <h1 className="text-sm font-medium text-gray-500">
          Nos produits 
        </h1>
        {productDisponibilities?.disponibilities.map((d) => (
          <div
            key={d.productId}
            className="flex items-center justify-between gap-2 border-b py-2 text-sm"
          >
            <p>{d.productName}</p>
            <p>{d.available ? "Disponible" : "Indisponible"}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default VisitsStats;
