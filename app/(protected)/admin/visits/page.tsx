import Link from "next/link";
import { Disponibility, Pos, User, UserRole, Visit } from "@prisma/client";
import { Plus } from "lucide-react";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/header";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";

import { DataTable } from "./Table";

export const metadata = constructMetadata({
  title: "Visites",
  description:
    "Ajoutez, modifiez et supprimez des visites pour suivre les visites.",
});

export type VisitWithDisponibilities = Visit & {
  disponibilities: Disponibility[];
  pos: Pos;
  user: User;
};

export default async function Visits() {
  //number of invoices and quotes per client
  const visits = await prisma.visit.findMany({
    include: {
      disponibilities: true,
      pos: true,
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const commerciaux = await prisma.user.findMany({
    where: {
      role: UserRole.USER,
    },
  });
  return (
    <>
      <DashboardHeader
        heading="Visites"
        text={`Les visites sont des rendez-vous avec les commerciaux pour les aider à vendre des produits.`}
      ></DashboardHeader>
      {visits!.length == 0 && (
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="calendar" />
          <EmptyPlaceholder.Title>
            Pas de visites trouvés
          </EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            Ajoutez une visite pour suivre les visites.
          </EmptyPlaceholder.Description>
          <Link href="/dashboard/visits/create">
            <Button className="relative flex h-9 items-center justify-center gap-2 p-2">
              <Plus size={18} className="" />
              <span className="flex-1 truncate text-center">Ajouter</span>
            </Button>
          </Link>
        </EmptyPlaceholder>
      )}
      {visits!.length > 0 && (
        <DataTable
          data={visits as VisitWithDisponibilities[]}
          commerciaux={commerciaux}
        />
      )}
    </>
  );
}
