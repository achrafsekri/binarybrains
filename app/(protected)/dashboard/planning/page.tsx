import Link from "next/link";
import { addDays, format } from "date-fns";
import { CalendarClock, Check, MapPin, PlusCircle } from "lucide-react";
import { MdDirections } from "react-icons/md";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/header";

import CalendarPicker from "./_components/CalendarPicker";
import MarkAsDoneButton from "./_components/MarkAsDoneButton";

export const metadata = constructMetadata({
  title: "Planning",
  description: "Planifiez vos visites.",
});

export default async function Pos({
  searchParams,
}: {
  searchParams: { date: string };
}) {
  const user = await getCurrentUser();
  const { date } = searchParams;
  const planning = await prisma.plan.findMany({
    where: {
      userId: user?.id,
      ...(date
        ? {
            date: {
              gte: new Date(date),
              lte: addDays(new Date(date), 1),
            },
          }
        : {}),
    },
    include: {
      pos: true,
    },
  });


  return (
    <>
      <DashboardHeader heading="Planning" text={`Planifiez vos visites.`}>
        <Link href="/dashboard/planning/create">
          <Button className="relative flex h-9 items-center justify-center gap-2 p-2">
            <PlusCircle size={18} />
            Ajouter
          </Button>
        </Link>
      </DashboardHeader>
      <CalendarPicker date={date} />
      <div className="flex h-[40vh] flex-col gap-4 overflow-y-auto">
        {planning.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <span className="text-sm text-muted-foreground">
              Aucun plan trouvé
            </span>
          </div>
        ) : (
          planning.map((plan) => {
            const isDone = plan.isDone;
            return (
              <div
                key={plan.id}
                className="flex justify-between rounded-md border p-4"
              >
                <div className="flex flex-col gap-2">
                  <span className="font-medium">{plan.name}</span>
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin size={16} />
                    {plan.pos.nom}
                    <Link
                      href={`https://www.google.com/maps/dir/?api=1&destination=${plan.pos.lat},${plan.pos.lng}`}
                      className="text-muted-foreground"
                      target="_blank"
                    >
                      <MdDirections size={16} />
                    </Link>
                  </span>
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarClock size={16} />
                    {format(plan.date, "dd/MM/yyyy, HH:mm")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {isDone ? (
                    <Badge
                      variant="outline"
                      className="bg-green-500 text-white"
                    >
                      Effectué
                    </Badge>
                  ) : (
                    <MarkAsDoneButton planId={plan.id} />
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
