import Link from "next/link";
import { Plus } from "lucide-react";

import { InvoiceWithRelations } from "@/types/invoice-with-relations";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/header";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";

import { DataTable } from "./Table";

export const metadata = constructMetadata({
  title: "Les clients- alloFacture",
  description:
    "Ajoutez, modifiez et supprimez des clients pour suivre les factures et les paiements.",
});

export default async function ScopeOfWork() {
  const user = await getCurrentUser();
  //number of invoices and quotes per client
  const clients = await prisma.customer.findMany({
    where: {
      userId: user!.id ?? "",
    },
    include: {
      invoices: {
        select: {
          id: true,
        },
      },
      quotes: {
        select: {
          id: true,
        },
      },
    },
  });

  return (
    <>
      <DashboardHeader
        heading="Clients"
        text={`Ajoutez, modifiez et supprimez des clients pour suivre les factures et les paiements.`}
      >
        <Button>Ajouter un client</Button>
      </DashboardHeader>
      {clients!.length == 0 && (
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="users" />
          <EmptyPlaceholder.Title>
            Pas des Clients trouvés
          </EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            Ajoutez un client pour suivre les factures et les paiements.
          </EmptyPlaceholder.Description>
          <Button className="relative flex h-9 items-center justify-center gap-2 p-2">
            <Plus size={18} className="" />
            <span className="flex-1 truncate text-center">
              Ajouter un client
            </span>
          </Button>
        </EmptyPlaceholder>
      )}
      {clients!.length > 0 && <DataTable data={clients} />}
    </>
  );
}
