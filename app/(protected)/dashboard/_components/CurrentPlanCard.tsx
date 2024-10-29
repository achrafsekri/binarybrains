"use client";

import { startTransition, useTransition } from "react";
import { generateUserStripe } from "@/actions/generate-user-stripe";
import { UserSubscriptionPlan } from "@/types";
import { format } from "date-fns";
import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icons } from "@/components/shared/icons";

export default function CurrentPlanCard({
  subscriptionPlan,
}: {
  subscriptionPlan: UserSubscriptionPlan;
}) {
  let [isPending, startTransition] = useTransition();
  const generateUserStripeSession = generateUserStripe.bind(null);

  const stripeSessionAction = () =>
    startTransition(async () => await generateUserStripeSession());
  return (
    <Card>
      <CardHeader>
        <CardTitle>Plan Actuel</CardTitle>
        <CardDescription>Détails de votre abonnement</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{subscriptionPlan?.title}</p>

        <p className="text-sm text-gray-500">{subscriptionPlan?.description}</p>
        {subscriptionPlan.isPaid && (
          <p className="text-sm text-gray-500">
            {format(subscriptionPlan?.stripeCurrentPeriodEnd, "dd/MM/yyyy")}
          </p>
        )}
      </CardContent>
      {subscriptionPlan.isPaid && (
        <CardFooter>
          <Button className="w-full" onClick={stripeSessionAction}>
            Gérer l&apos;Abonnement
            {!isPending && <ArrowUpRight className="ml-2 size-4" />}
            {isPending && (
              <Icons.spinner className="ml-2 size-4 animate-spin" />
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
