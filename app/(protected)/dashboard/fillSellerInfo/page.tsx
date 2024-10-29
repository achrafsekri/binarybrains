import { User } from "@prisma/client";

import { planLimits } from "@/config/subscriptions";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { getUserSubscriptionPlan } from "@/lib/subscription";

import NewSellerForm from "./NewSellerForm";

export default async function Page() {
  const user = await getCurrentUser();
  const seller = await prisma.seller.findFirst({
    where: { userId: user?.id },
  });

  return (
    <>
      <NewSellerForm seller={seller} />
    </>
  );
}
