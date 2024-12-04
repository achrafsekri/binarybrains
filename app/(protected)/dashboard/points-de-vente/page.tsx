import Link from "next/link";
import { Plus, PlusCircle } from "lucide-react";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/header";
import Map from "@/components/layout/Map";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";

export const metadata = constructMetadata({
  title: "Les clients- alloFacture",
  description:
    "Ajoutez, modifiez et supprimez des clients pour suivre les factures et les paiements.",
});

export default async function ScopeOfWork() {
  const pos = await prisma.pos.findMany({});

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

      {pos.length === 0 ? (
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="mapPin" />
          <EmptyPlaceholder.Title>
            Pas des points de vente trouvés
          </EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            Ajoutez un point de vente pour suivre les visites.
          </EmptyPlaceholder.Description>
          <Link href="/dashboard/points-de-vente/create">
            <Button className="relative flex h-9 items-center justify-center gap-2 p-2">
              <Plus size={18} className="" />
              <span className="flex-1 truncate text-center">
                Ajouter un point de vente
              </span>
            </Button>
          </Link>
        </EmptyPlaceholder>
      ) : (
        <div className="relative size-full overflow-hidden">
          <Map pos={pos} />
        </div>
      )}
    </>
  );
}
