import { PlansRow, SubscriptionPlan } from "types";
import { env } from "@/env.mjs";

export const pricingData: SubscriptionPlan[] = [
  {
    title: "Débutant",
    description: "Pour les débutants",
    benefits: [
      "Jusqu'à 10 factures par mois",
      "Jusqu'à 10 devis par mois",
      "Accès aux modèles de base",
    ],
    limitations: [
      "Limité à 3 clients",
      "Envoi illimité de rappels",
      "Accès limité au support",
    ],
    prices: {
      monthly: 0,
      yearly: 0,
    },
    stripeIds: {
      monthly: null,
      yearly: null,
    },
  },
  {
    title: "Pro",
    description: "Pour les professionnels",
    benefits: [
      "Jusqu'à 100 factures par mois",
      "Jusqu'à 100 devis par mois",
      "Accès à tous les modèles",
      "Envoi illimité de rappels",
      "Un nombre illimité de clients",
      "Support clientèle 24/7",
      "Accès à des ressources commerciales.",
    ],
    limitations: [],
    prices: {
      monthly: 12,
      yearly: 100,
    },
    stripeIds: {
      monthly: env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PLAN_ID,
      yearly: env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PLAN_ID,
    },
  },
  {
    title: "Business",
    description: "Pour les entreprises en croissance",
    benefits: [
      "Un nombre illimité de factures et devis",
      "Accès à tous les modèles, y compris le branding personnalisé",
      "Envoi illimité de rappels",
      "Un nombre illimité de clients",
      "Support clientèle prioritaire",
      "Rapports avancés",
    ],
    limitations: [],
    prices: {
      monthly: 20,
      yearly: 200,
    },
    stripeIds: {
      monthly: env.NEXT_PUBLIC_STRIPE_BUSINESS_MONTHLY_PLAN_ID,
      yearly: env.NEXT_PUBLIC_STRIPE_BUSINESS_YEARLY_PLAN_ID,
    },
  },
];

export const plansColumns = ["Débutant", "pro", "business"] as const;

export const comparePlans: PlansRow[] = [
  {
    feature: "Accès aux analyses",
    Débutant: false,
    pro: true,
    business: true,
    enterprise: "Custom",
    tooltip: "Les analyses avancées sont disponibles à partir du plan Pro.",
  },
  {
    feature: "Factures",
    Débutant: "10/mo",
    pro: "100/mo",
    business: "Illimité",
    enterprise: "Unlimited",
    tooltip: "Creez jusqu'à 100 factures par mois avec le plan Pro.",
  },

  {
    feature: "Devis",
    Débutant: "10/mo",
    pro: "100/mo",
    business: "Illimité",
    enterprise: "Custom",
    tooltip:
      "Créez jusqu'à 100 devis par mois avec le plan Pro et illimité avec le plan Business.",
  },
  {
    feature: "Rappels",
    Débutant: false,
    pro: "Illimité",
    business: "Illimité",
    enterprise: "Full",
    tooltip: "Envoyez des rappels illimités avec les plans Pro et Business.",
  },
  {
    feature: "Clients",
    Débutant: "3",
    pro: "Illimité",
    business: "Illimité",
    enterprise: true,
    tooltip:
      "Le nombre de clients est illimité avec les plans Pro et Business.",
  },
  {
    feature: "Support",
    Débutant: "Email",
    pro: "24/7 Support",
    business: "24/7 Support",
    enterprise: "24/7 Support",
  },

  // Add more rows as needed
];
type PlanLimits = Record <string, number | string>;
export const planLimits:Record<string , PlanLimits> = {
  débutant: { Factures: 10, Devis: 10, clients:3 },
  pro: { Factures: 100, Devis: 100 , clients:"Illimité"},
  business: { Factures: "Illimité", Devis: "Illimité" , clients:"Illimité"},
};
