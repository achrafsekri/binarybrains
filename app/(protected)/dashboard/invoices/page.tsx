import Link from "next/link";
import clsx from "clsx";
import { Plus } from "lucide-react";

import { InvoiceWithRelations } from "@/types/invoice-with-relations";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import {
  getUserSubscriptionPlan,
  isInvoicePlanExceeded,
} from "@/lib/subscription";
import { constructMetadata } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DashboardHeader } from "@/components/dashboard/header";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";

import { DataTable } from "./Table";

export const metadata = constructMetadata({
  title: "Mes factures- alloFacture",
  description: "Suivez les factures et les paiements pour vos projets.",
});

export default async function Page() {
  const user = await getCurrentUser();
  const invoices: InvoiceWithRelations[] = await prisma.invoice.findMany({
    where: {
      userId: user!.id,
    },
    include: {
      seller: true,
      items: true,
      customer: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const isPlanExceeded = await isInvoicePlanExceeded();
  return (
    <>
      <DashboardHeader
        heading="Mes factures"
        text={`Suivez les factures et les paiements pour vos projets.`}
      >
        {isPlanExceeded && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className={clsx(
                    "relative flex h-9 items-center justify-center gap-2 p-2",
                    isPlanExceeded && "cursor-not-allowed opacity-50",
                  )}
                  disabled={isPlanExceeded}
                >
                  <Plus size={18} className="" />
                  <span className="hidden md:block">Créer une facture</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Vous avez atteint la limite de factures pour votre plan.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        {!isPlanExceeded && (
          <Link href="/dashboard/invoices/create">
            <Button className="relative flex h-9 items-center justify-center gap-2 p-2">
              <Plus size={18} className="" />
              <span className="hidden md:block">Créer une facture</span>
            </Button>
          </Link>
        )}
      </DashboardHeader>
      {invoices!.length == 0 && (
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="post" />
          <EmptyPlaceholder.Title>
            Pas des factures pour le moment
          </EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            Créez une facture pour commencer à suivre le travail effectué.
          </EmptyPlaceholder.Description>
          <Link href="/dashboard/invoices/create">
            <Button
              className={clsx(
                "relative flex h-9 items-center justify-center gap-2 p-2",
                isPlanExceeded && "cursor-not-allowed opacity-50",
              )}
              disabled={isPlanExceeded}
            >
              <Plus size={18} className="" />
              <span className="flex-1 truncate text-center">
                Créer une facture
              </span>
            </Button>
          </Link>
        </EmptyPlaceholder>
      )}
      {invoices!.length > 0 && <DataTable data={invoices} />}
    </>
  );
}
