import { Skeleton } from "@/components/ui/skeleton";
import { DashboardHeader } from "@/components/dashboard/header";

export default function DashboardLoading() {
  return (
    <>
      <DashboardHeader heading="Team Members" text="Add or remove team members." />
      <Skeleton className="size-full rounded-lg" />
    </>
  );
}
