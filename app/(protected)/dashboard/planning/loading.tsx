import { Skeleton } from "@/components/ui/skeleton";
import { DashboardHeader } from "@/components/dashboard/header";

export default function DashboardLoading() {
  return (
    <>
      <DashboardHeader
        heading="Points de vente"
        text="Ajouter, modifier ou supprimer des points de vente."
      />
      <Skeleton className="size-full rounded-lg" />
    </>
  );
}
