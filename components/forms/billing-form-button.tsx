"use client";

import { useTransition } from "react";
import { generateUserStripe } from "@/actions/generate-user-stripe";
import { SubscriptionPlan, UserSubscriptionPlan } from "@/types";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";
import { cn } from "@/lib/utils";

interface BillingFormButtonProps {
  offer: SubscriptionPlan;
  subscriptionPlan: UserSubscriptionPlan;
  year: boolean;
  className?:string
}

export function BillingFormButton({
  year,
  offer,
  subscriptionPlan,
  className
}: BillingFormButtonProps) {
  let [isPending, startTransition] = useTransition();
  const generateUserStripeSession = generateUserStripe.bind(
    null,
    offer.stripeIds[year ? "yearly" : "monthly"],
  );

  const stripeSessionAction = () =>
    startTransition(async () => await generateUserStripeSession());

  const userOffer =
    subscriptionPlan.stripePriceId ===
    offer.stripeIds[year ? "yearly" : "monthly"];

  return (
    <Button
      variant={userOffer ? "default" : "outline"}
      rounded="full"
      className={cn("w-full",className)}
      disabled={isPending}
      onClick={stripeSessionAction}
    >
      {isPending ? (
        <>
          <Icons.spinner className="mr-2 size-4 animate-spin" /> Loading...
        </>
      ) : (
        <>{userOffer ? "Gérer l'Abonnement" : "Upgrade"}</>
      )}
    </Button>
  );
}