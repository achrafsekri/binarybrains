import Link from "next/link";
import { UserRole } from "@prisma/client";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/header";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";

import { DataTable } from "../../dashboard/visits/Table";

export const metadata = constructMetadata({
  title: "Commerciaux",
  description: "Liste des commerciaux.",
});

export type UserWithRelations = User & {};

export default async function Team() {
  const user = await getCurrentUser();
  const commerciaux = await prisma.user.findMany({
    where: {
      role: UserRole.USER,
    },
  });
  return (
    <>
      <DashboardHeader heading="Commerciaux" text={`Liste des commerciaux.`} />
      {commerciaux.length === 0 ? (
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="users" />
          <EmptyPlaceholder.Title>Pas de commerciaux</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            Vous n&apos;avez pas encore de commerciaux. Commencez par créer un
            commercial.
          </EmptyPlaceholder.Description>
          <Button>
            <Link href="/admin/commerciaux/create">Créer un commercial</Link>
          </Button>
        </EmptyPlaceholder>
      ) : (
        <DataTable data={commerciaux as UserWithRelations[]} />
      )}
    </>
  );
}
