import Link from "next/link";
import { State } from "@prisma/client";
import { Plus, PlusCircle } from "lucide-react";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/header";
import Map from "@/components/layout/Map";

import StatesFilter from "./_components/StatesFilter";

export const metadata = constructMetadata({
  title: "Les clients- Sotacib",
  description:
    "Ajoutez, modifiez et supprimez des clients pour suivre les factures et les paiements.",
});

export default async function Pos({
  searchParams,
}: {
  searchParams: { state: State };
}) {
  const products = await prisma.product.findMany({
    include: {
      company: true,
    },
  });
  return (
    <>
      <DashboardHeader
        heading="Points de vente"
        text={`Ajouter, modifier ou supprimer des points de vente.`}
      >
        <Link href="/dashboard/points-de-vente/create">
          <Button className="relative flex h-9 items-center justify-center gap-2 p-2">
            <PlusCircle size={18} />
            Ajouter
          </Button>
        </Link>
      </DashboardHeader>

      <div className="relative size-full overflow-hidden">
        <Map products={products} />
      </div>
    </>
  );
}
