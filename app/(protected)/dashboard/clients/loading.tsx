import { Skeleton } from "@/components/ui/skeleton";
import { DashboardHeader } from "@/components/dashboard/header";

export default function DashboardLoading() {
  return (
    <>
      <DashboardHeader
        heading="Invite Clients"
        text="Invite clients and engage with them."
      />
      <Skeleton className="size-full rounded-lg" />
    </>
  );
}
