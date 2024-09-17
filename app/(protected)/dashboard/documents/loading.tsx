import { Skeleton } from "@/components/ui/skeleton";
import { DashboardHeader } from "@/components/dashboard/header";

export default function DashboardLoading() {
  return (
    <>
      <DashboardHeader heading="Uploaded Assets" text="Upload and manage assets for your website." />
      <Skeleton className="size-full rounded-lg" />
    </>
  );
}
