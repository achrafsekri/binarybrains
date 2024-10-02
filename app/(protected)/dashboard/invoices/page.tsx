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
  title: "Mes factures- alloFacture",
  description: "Suivez les factures et les paiements pour vos projets.",
});

export default async function Page() {
  const user = await getCurrentUser();
  const invoices: InvoiceWithRelations[] = await prisma.invoice.findMany({
    where: {
      userId: user!.id,
    },
    include: {
      seller: true,
      customer: true,
    },
  });
  return (
    <>
      <DashboardHeader
        heading="Mes factures"
        text={`Suivez les factures et les paiements pour vos projets.`}
      >
        <Link href="/dashboard/invoices/create">
          <Button>
            <span className="hidden md:block">Créer une facture</span>
            <Plus size={18} className="md:hidden" />
          </Button>
        </Link>
      </DashboardHeader>
      {invoices!.length == 0 && (
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="post" />
          <EmptyPlaceholder.Title>
            Pas des factures pour le moment
          </EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            Créez une facture pour commencer à suivre le travail effectué.
          </EmptyPlaceholder.Description>
          <Link href="/dashboard/invoices/create">
            <Button className="relative flex h-9 items-center justify-center gap-2 p-2">
              <Plus size={18} className="" />
              <span className="flex-1 truncate text-center">
                Créer une facture
              </span>
            </Button>
          </Link>
        </EmptyPlaceholder>
      )}
      {invoices!.length > 0 && <DataTable data={invoices} />}
    </>
  );
}
