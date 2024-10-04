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
  const Limits = planLimits[subscriptionPlan.title.toLowerCase()];
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
        <CardTitle>Utilisation Mensuelle</CardTitle>
        <CardDescription>Factures et devis créés ce mois-ci</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="mb-1 flex text-sm">
            Factures: {InvoicesUsage}/{Limits?.Factures}
          </div>
          <Progress value={InvoicesUsage} className="h-2" />
        </div>
        <div>
          <div className="mb-1 flex text-sm">
            Devis: {QuotesUsage}/{Limits?.Devis}
          </div>
          <Progress value={QuotesUsage} className="h-2" />
        </div>
        <p className="text-sm text-gray-500">
          Vous avez utilisé {InvoicesUsage + QuotesUsage} sur{" "}
          {typeof Limits?.Factures == "string" ||
          typeof Limits?.Devis == "string"
            ? "illimité"
            : Limits?.Factures + Limits?.Devis}{" "}
          documents au total
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          Voir l&apos;Utilisation Détailée
        </Button>
      </CardFooter>
    </Card>
  );
}
