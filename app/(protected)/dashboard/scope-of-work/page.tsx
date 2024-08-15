import { getCurrentUserDeliverables } from "@/lib/queries";
import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/header";
import CreateDeliverable from "@/components/forms/create-deliverable";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";

import DeliverablesList from "./deliverables-list";

export const metadata = constructMetadata({
  title: "Scope of Work - Modhif",
  description: "Define and track the scope of work for your project.",
});

export default async function ScopeOfWork() {
  const deliverables = await getCurrentUserDeliverables();
  return (
    <>
      <DashboardHeader
        heading="Scope of Work"
        text={`Define and track the scope of work for your project.`}
      />
      {deliverables!.length == 0 && (
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="post" />
          <EmptyPlaceholder.Title>No content created</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            You don&apos;t have any content yet. Start creating content.
          </EmptyPlaceholder.Description>
          <CreateDeliverable />
        </EmptyPlaceholder>
      )}
      {deliverables!.length > 0 && (
        <div className="rounded-lg border border-dashed p-8 shadow-sm animate-in fade-in-50">
          <DeliverablesList delivarables={deliverables} />
        </div>
      )}
    </>
  );
}
