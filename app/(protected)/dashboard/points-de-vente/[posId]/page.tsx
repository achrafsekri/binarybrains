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
    <div className="relative h-[calc(100vh-5rem)] overflow-y-auto">
      <DashboardHeader
        heading={pos.nom}
        text={`${pos.city ?? ""} - ${pos.state ?? ""} , ${
          pos.type == "CLIENT" ? "Client" : "Point de vente"
        }`}
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

      <div className="grid gap-4">
        <VisitsStats visits={visits} posId={pos.id} />
        <div className="relative size-full overflow-hidden">
          <h2 className="text-lg font-semibold">Visites</h2>
          <DataTable data={visits} />
        </div>
      </div>

      <Button className="fixed bottom-4 right-4 z-50" size="sm">
        <Link
          href={`/dashboard/visits/create?posId=${pos.id}`}
          className="flex items-center rounded-full"
        >
          <PlusCircle className="size-4" />
        </Link>
      </Button>
    </div>
  );
};

export default page;
