import { UserSubscriptionPlan } from "@/types";
import { User } from "@prisma/client";

import { planLimits } from "@/config/subscriptions";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default async function UsageCard({
  subscriptionPlan,
  user,
}: {
  user: User;
  subscriptionPlan: UserSubscriptionPlan;
}) {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const firstDayOfNextMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    1,
  );


  const Limits = planLimits[subscriptionPlan.title];
  const QuotesUsagePromise = prisma.quote.count({
    where: {
      userId: user?.id,
      createdAt: {
        gte: firstDayOfMonth,
        lt: firstDayOfNextMonth,
      },
    },
  });
  const InvoicesUsagePromise = prisma.invoice.count({
    where: {
      userId: user?.id,
      createdAt: {
        gte: firstDayOfMonth,
        lt: firstDayOfNextMonth,
      },
    },
  });
  const [InvoicesUsage, QuotesUsage] = await Promise.all([
    InvoicesUsagePromise,
    QuotesUsagePromise,
  ]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Usage</CardTitle>
        <CardDescription>
          Invoices and quotes created this month
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="mb-1 flex justify-between text-sm">
            <span>
              Invoices: {InvoicesUsage}/{Limits.Factures}
            </span>
            <span>
              Quotes: {QuotesUsage}/{Limits.Devis}
            </span>
          </div>
          <Progress value={InvoicesUsage} className="h-2" />
        </div>
        <p className="text-sm text-gray-500">
          You&apos;ve used {InvoicesUsage + QuotesUsage} out of {Limits.Factures + Limits.Devis} total documents
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          View Detailed Usage
        </Button>
      </CardFooter>
    </Card>
  );
}
