import Link from "next/link";
import { Plus } from "lucide-react";

import { QuoteWithRelations } from "@/types/quote-with-relations";
import { prisma } from "@/lib/db";
import { constructMetadata } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/header";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";

import { DataTable } from "./Table";

export const metadata = constructMetadata({
  title: "Mes devis- alloFacture",
  description: "Suivez les devis pour vos projets.",
});

export default async function ScopeOfWork() {
  const quotes: QuoteWithRelations[] = await prisma.quote.findMany({
    include: {
      seller: true,
      customer: true,
    },
  });
  console.log("les devis: ", quotes);
  return (
    <>
      <DashboardHeader
        heading="Mes devis"
        text={`Suivez les devis pour vos projets.`}
      />
      {quotes!.length == 0 && (
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="post" />
          <EmptyPlaceholder.Title>
            Pas des devis pour le moment
          </EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            Créez un devis pour commencer à suivre le travail effectué.
          </EmptyPlaceholder.Description>
          <Link href="/dashboard/quotes/create">
            <Button className="relative flex h-9 items-center justify-center gap-2 p-2">
              <Plus size={18} className="" />
              <span className="flex-1 truncate text-center">
                Créer un devis
              </span>
            </Button>
          </Link>
        </EmptyPlaceholder>
      )}
      {/* @ts-ignore */}
      {quotes!.length > 0 && <DataTable data={quotes} />}
    </>
  );
}
