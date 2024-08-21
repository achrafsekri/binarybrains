import { getCurrentUserMilestones } from "@/lib/queries";
import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/header";
import CreateMilestone from "@/components/forms/create-milestone";
import CreateTask from "@/components/forms/create-task";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";

import DeliverablesList from "./deliverables-list";

export const metadata = constructMetadata({
  title: "Scope of Work - Modhif",
  description: "Define and track the scope of work for your project.",
});

export default async function ScopeOfWork() {
  const milestones = await getCurrentUserMilestones();
  return (
    <>
      <DashboardHeader
        heading="Scope of Work"
        text={`Define and track the scope of work for your project.`}
      />
      {milestones!.length == 0 && (
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="post" />
          <EmptyPlaceholder.Title>No milestones created</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            You don&apos;t have any milestones yet. Start by creating one.
          </EmptyPlaceholder.Description>
          <CreateMilestone />
        </EmptyPlaceholder>
      )}
      {/* {milestones!.length > 0 && (
        <div className="rounded-lg border border-dashed p-8 shadow-sm animate-in fade-in-50">
          <DeliverablesList delivarables={deliverables} />
        </div>
      )} */}
    </>
  );
}
