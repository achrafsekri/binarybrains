import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PencilIcon, PlusCircle, Trash2Icon } from "lucide-react";
import { MdDirections } from "react-icons/md";

import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/header";

import { DataTable } from "../../visits/Table";
import VisitsStats from "./VisitsStats";

const page = async ({ params }: { params: { posId: string } }) => {
  const pos = await prisma.pos.findFirst({
    where: {
      id: params.posId,
    },
  });
  if (!pos) {
    notFound();
  }
  const visits = await prisma.visit.findMany({
    where: {
      posId: params.posId,
    },
    include: {
      disponibilities: {
        include: {
          product: true,
        },
      },
      pos: true,
    },
  });

  return (
    <>
      <DashboardHeader
        heading={pos.nom}
        text={`${pos.city ?? ""} - ${pos.state ?? ""} `}
        phone={pos.phone ?? ""}
      >
        <Button variant="outline" size="sm">
          <Link
            href={`https://www.google.com/maps/dir/?api=1&destination=${pos.lat},${pos.lng}`}
            target="_blank"
            className="flex items-center"
          >
            <MdDirections className="size-4" />
          </Link>
        </Button>
        <Button variant="outline" size="sm">
          <Link
            href={`/dashboard/points-de-vente/${pos.id}/edit`}
            className="flex items-center"
          >
            <PencilIcon className="size-4" />
          </Link>
        </Button>

        <Button variant="outline" size="sm">
          <Link
            href={`/dashboard/points-de-vente/${pos.id}/delete`}
            className="flex items-center"
          >
            <Trash2Icon className="size-4" />
          </Link>
        </Button>
      </DashboardHeader>
      <Button className="absolute bottom-4 right-4" size="sm">
        <Link
          href={`/dashboard/visits/create?posId=${pos.id}`}
          className="flex items-center"
        >
          <PlusCircle className="mr-2 size-4" />
          Ajouter une visite
        </Link>
      </Button>
      <div className="grid gap-4">
        <VisitsStats visits={visits} />
        <div className="relative size-full overflow-hidden">
          <h2 className="text-lg font-semibold">Visites</h2>
          <DataTable data={visits} />
        </div>
      </div>
    </>
  );
};

export default page;
