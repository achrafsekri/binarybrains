import { Customer, User } from "@prisma/client";

import { planLimits } from "@/config/subscriptions";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { getUserSubscriptionPlan } from "@/lib/subscription";

import EditClientForm from "./EditClientForm";

export default async function Page({
  params,
}: {
  params: { clientId: string };
}) {
  const client = await prisma.customer.findFirst({
    where: { id: params.clientId },
  });
  return (
    <>
      <EditClientForm client={client as Customer} />
    </>
  );
}
