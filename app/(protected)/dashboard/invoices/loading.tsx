import { Skeleton } from "@/components/ui/skeleton";
import { DashboardHeader } from "@/components/dashboard/header";

export default function DashboardLoading() {
  return (
    <>
      <DashboardHeader heading="Scope Of Work" text="Define and track the scope of work for your project." />
      <Skeleton className="size-full rounded-lg" />
    </>
  );
}
