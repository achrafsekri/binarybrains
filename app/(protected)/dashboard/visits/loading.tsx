import { Skeleton } from "@/components/ui/skeleton";
import { DashboardHeader } from "@/components/dashboard/header";

export default function DashboardLoading() {
  return (
    <>
      <DashboardHeader
        heading="Visites"
        text="Ajouter, modifier ou supprimer des visites, pour les utiliser dans vos factures et devis."
      />
      <Skeleton className="size-full rounded-lg" />
    </>
  );
}
