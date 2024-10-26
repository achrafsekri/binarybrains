import { Skeleton } from "@/components/ui/skeleton";
import { DashboardHeader } from "@/components/dashboard/header";

export default function DashboardLoading() {
  return (
    <>
      <DashboardHeader
        heading="Mes devis"
        text="Suivez les devis effectués."
      />
      <Skeleton className="size-full rounded-lg" />
    </>
  );
}
