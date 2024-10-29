// @ts-nocheck
// TODO: Fix this when we turn strict mode on.
import { UserSubscriptionPlan } from "types";
import { planLimits, pricingData } from "@/config/subscriptions";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";

import { getCurrentUser } from "./session";

export async function getUserSubscriptionPlan(
  userId: string,
): Promise<UserSubscriptionPlan> {
  if (!userId) throw new Error("Missing parameters");

  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    select: {
      stripeSubscriptionId: true,
      stripeCurrentPeriodEnd: true,
      stripeCustomerId: true,
      stripePriceId: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Check if user is on a paid plan.
  const isPaid =
    user.stripePriceId &&
    user.stripeCurrentPeriodEnd?.getTime() + 86_400_000 > Date.now()
      ? true
      : false;

  // Find the pricing data corresponding to the user's plan
  const userPlan =
    pricingData.find((plan) => plan.stripeIds.monthly === user.stripePriceId) ||
    pricingData.find((plan) => plan.stripeIds.yearly === user.stripePriceId);

  const plan = isPaid && userPlan ? userPlan : pricingData[0];

  const interval = isPaid
    ? userPlan?.stripeIds.monthly === user.stripePriceId
      ? "month"
      : userPlan?.stripeIds.yearly === user.stripePriceId
        ? "year"
        : null
    : null;

  let isCanceled = false;
  if (isPaid && user.stripeSubscriptionId) {
    const stripePlan = await stripe.subscriptions.retrieve(
      user.stripeSubscriptionId,
    );
    isCanceled = stripePlan.cancel_at_period_end;
  }

  return {
    ...plan,
    ...user,
    stripeCurrentPeriodEnd: user.stripeCurrentPeriodEnd?.getTime(),
    isPaid,
    interval,
    isCanceled,
  };
}

export async function isInvoicePlanExceeded() {
  const user = await getCurrentUser();
  const subscriptionPlan = await getUserSubscriptionPlan(user?.id as string);
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const firstDayOfNextMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    1,
  );

  const invoices = await prisma.invoice.count({
    where: {
      userId: user!.id,
      createdAt: {
        gte: firstDayOfMonth,
        lt: firstDayOfNextMonth,
      },
    },
  });
  const limitInvoices =
    planLimits[subscriptionPlan?.title?.toLocaleLowerCase()];
  let exceeded = false;
  if (!limitInvoices || !limitInvoices.Factures) {
    exceeded = false;
  } else if (typeof limitInvoices?.Factures === "number") {
    exceeded = invoices > limitInvoices.Factures;
  }
  return exceeded;
}

export async function isQuotePlanExceeded() {
  const user = await getCurrentUser();
  const subscriptionPlan = await getUserSubscriptionPlan(user?.id as string);
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const firstDayOfNextMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    1,
  );
  const quotes = await prisma.quote.count({
    where: {
      userId: user!.id,
      createdAt: {
        gte: firstDayOfMonth,
        lt: firstDayOfNextMonth,
      },
    },
  });
  const limitQuotes = planLimits[subscriptionPlan?.title?.toLocaleLowerCase()];
  let exceeded = false;
  if (!limitQuotes || !limitQuotes.Quotes) {
    exceeded = false;
  } else if (typeof limitQuotes?.Quotes === "number") {
    exceeded = quotes > limitQuotes.Quotes;
  }
  return exceeded;
}
