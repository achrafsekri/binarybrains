import Link from "next/link";
import { Plus } from "lucide-react";

import { constructMetadata } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/header";
import CreateMilestone from "@/components/forms/create-milestone";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";

export const metadata = constructMetadata({
  title: "Mes factures- alloFacture",
  description: "Suivez les factures et les paiements pour vos projets.",
});

export default async function ScopeOfWork() {
  const invoices = [];
  return (
    <>
      <DashboardHeader
        heading="Mes factures"
        text={`Suivez les factures et les paiements pour vos projets.`}
      />
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
      {invoices!.length > 0 && (
        <div className="rounded-lg border border-dashed p-8 shadow-sm animate-in fade-in-50">
          invoice list
        </div>
      )}
    </>
  );
}
