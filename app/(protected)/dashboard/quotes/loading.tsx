import { Skeleton } from "@/components/ui/skeleton";
import { DashboardHeader } from "@/components/dashboard/header";

export default function DashboardLoading() {
  return (
    <>
      <DashboardHeader
        heading="Mes factures"
        text="Suivez les factures et les paiements pour vos projets."
      />
      <Skeleton className="size-full rounded-lg" />
    </>
  );
}
