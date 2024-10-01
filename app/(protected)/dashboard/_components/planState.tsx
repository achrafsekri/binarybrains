import { User } from "@prisma/client";
import { getUserSubscriptionPlan } from "@/lib/subscription";
import CurrentPlanCard from "./CurrentPlanCard";
import UpgradePlanCard from "./UpgradePlanCard";
import UsageCard from "./UsageCard";
import { UserSubscriptionPlan } from "@/types";

export default async function PlanState({ user }: { user: User }) {

  let subscriptionPlan;
  if (user && user.id) {
    subscriptionPlan = await getUserSubscriptionPlan(user.id);
  }

  return (
    <section className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {/* Current Plan Card */}
      <CurrentPlanCard subscriptionPlan={subscriptionPlan as UserSubscriptionPlan} />

      {/* Upgrade/Renew CTA Card */}
      <UpgradePlanCard subscriptionPlan={subscriptionPlan as UserSubscriptionPlan} />

      {/* Usage Statistics Card */}
      <UsageCard subscriptionPlan={subscriptionPlan as UserSubscriptionPlan} user={user} />
    </section>
  );
}
