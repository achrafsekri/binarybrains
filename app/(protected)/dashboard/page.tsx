import { redirect } from "next/navigation";
import { User } from "@prisma/client";

import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";

import PlanState from "./_components/planState";

export const metadata = constructMetadata({
  title: "Dashboard",
  description: "Create and manage content.",
});

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return (
    <>
      <DashboardHeader
        heading={`Welcome back, ${user?.name}!`}
        text={`Here's an overview of your account`}
      />
      <PlanState user={user as User} />
    </>
  );
}
