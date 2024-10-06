import { Skeleton } from "@/components/ui/skeleton";
import { DashboardHeader } from "@/components/dashboard/header";

export default function DashboardLoading() {
  return (
    <>
      <DashboardHeader
        heading="Clients"
        text="Ajouter, modifier ou supprimer des clients, pour les utiliser dans vos factures et devis."
      />
      <Skeleton className="size-full rounded-lg" />
    </>
  );
}
