import { planLimits } from "@/config/subscriptions";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { getUserSubscriptionPlan } from "@/lib/subscription";

import NewClientForm from "./NewClientForm";
import { User } from "@prisma/client";

export default async function Page() {
  const user = await getCurrentUser();
  const clients = await prisma.customer.count({
    where: { userId: user?.id },
  });
  const subscriptionPlan = await getUserSubscriptionPlan(user?.id as string);
  const limitCustomers =
    planLimits[subscriptionPlan?.title?.toLocaleLowerCase()];
  let hasAccess = true;
  if (!limitCustomers || !limitCustomers.clients) {
    hasAccess = false;
  } else if (typeof limitCustomers?.clients === "number") {
    hasAccess = clients < limitCustomers.clients;
  }
  return (
    <>
      <NewClientForm hasAccess={hasAccess} user={user as User} />
    </>
  );
}
