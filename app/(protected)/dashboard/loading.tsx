import { Skeleton } from "@/components/ui/skeleton";
import { DashboardHeader } from "@/components/dashboard/header";

export default function DashboardLoading() {
  return (
    <>
      <DashboardHeader
        heading="Bienvenue de nouveau"
        text="Voici un aperçu de votre compte."
      />
      <Skeleton className="size-full rounded-lg" />
    </>
  );
}
