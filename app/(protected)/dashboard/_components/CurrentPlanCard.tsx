import { UserSubscriptionPlan } from "@/types";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

export default function CurrentPlanCard({ subscriptionPlan }: { subscriptionPlan: UserSubscriptionPlan }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Plan Actuel</CardTitle>
                <CardDescription>Détails de votre abonnement</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-2xl font-bold">{subscriptionPlan?.title}</p>

                <p className="text-sm text-gray-500">
                    {subscriptionPlan?.description}
                </p>
                {subscriptionPlan.isPaid && (
                    <p className="text-sm text-gray-500">
                        {subscriptionPlan?.stripeCurrentPeriodEnd}
                    </p>
                )}
            </CardContent>
            <CardFooter>
                <Button className="w-full">
                    Gérer l&apos;Abonnement
                    <ArrowUpRight className="ml-2 size-4" />
                </Button>
            </CardFooter>
        </Card>
    )
}
