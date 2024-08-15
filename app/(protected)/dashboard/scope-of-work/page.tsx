import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/header";
import CreateTask from "@/components/forms/create-task";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";

export const metadata = constructMetadata({
  title: "Scope of Work - Modhif",
  description: "Define and track the scope of work for your project.",
});

export default async function ScopeOfWork() {
  const user = await getCurrentUser();

  return (
    <>
      <DashboardHeader
        heading="Scope of Work"
        text={`Define and track the scope of work for your project.`}
      />
      <EmptyPlaceholder>
        <EmptyPlaceholder.Icon name="post" />
        <EmptyPlaceholder.Title>No content created</EmptyPlaceholder.Title>
        <EmptyPlaceholder.Description>
          You don&apos;t have any content yet. Start creating content.
        </EmptyPlaceholder.Description>
        <CreateTask />
      </EmptyPlaceholder>
    </>
  );
}
