import { User } from "@prisma/client";
import { getUserSubscriptionPlan } from "@/lib/subscription";
import CurrentPlanCard from "./CurrentPlanCard";
import UpgradePlanCard from "./UpgradePlanCard";
import UsageCard from "./UsageCard";

export default async function PlanState({ user }: { user: User }) {
 
  let subscriptionPlan;
  if (user && user.id) {
    subscriptionPlan = await getUserSubscriptionPlan(user.id);
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {/* Current Plan Card */}
      <CurrentPlanCard subscriptionPlan={subscriptionPlan} />

      {/* Upgrade/Renew CTA Card */}
      <UpgradePlanCard subscriptionPlan={subscriptionPlan} />

      {/* Usage Statistics Card */}
      <UsageCard subscriptionPlan={subscriptionPlan} user={user} />
    </div>
  );
}
