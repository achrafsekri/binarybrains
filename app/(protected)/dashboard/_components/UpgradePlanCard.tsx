import { UserSubscriptionPlan } from "@/types";
import { pricingData } from "@/config/subscriptions";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BillingFormButton } from "@/components/forms/billing-form-button";

export default function UpgradePlanCard({
  subscriptionPlan,
}: {
  subscriptionPlan: UserSubscriptionPlan;
}) {
  const proposedUpgrade = pricingData.filter(
    (offer) =>
      offer.title !== subscriptionPlan.title && offer.title !== "Débutant",
  )[0];

  return (
    <Card className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
      <CardHeader>
        <CardTitle>Upgrade Your Plan</CardTitle>
        <CardDescription className="text-purple-100">
          Get more features and higher limits
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-2">Unlock {proposedUpgrade.title} features:</p>
        <ul className="list-inside list-disc space-y-1 text-sm">
          {proposedUpgrade.benefits.map((benefit) => (
            <li key={benefit}>{benefit}</li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <BillingFormButton
        //always false until we find a way to know whether it is yearly or not
          year={false}
          offer={proposedUpgrade}
          subscriptionPlan={subscriptionPlan}
          className="hover:bg-transparent hover:text-white"
        />
      </CardFooter>
    </Card>
  );
}
