import { redirect } from "next/navigation";
import { User } from "@prisma/client";

import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";
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
        heading={`Bienvenue de nouveau ${user?.name ? "," + user?.name : ""}!`}
        text={`Voici un aperçu de votre compte`}
      />
    </>
  );
}
