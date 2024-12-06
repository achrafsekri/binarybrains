import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NotificationType } from "@prisma/client";
import { format } from "date-fns";
import { Bell, Terminal } from "lucide-react";
import { MdScore } from "react-icons/md";

import { prisma } from "@/lib/db";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { DashboardHeader } from "@/components/dashboard/header";
import { DataTable } from "@/app/(protected)/dashboard/visits/Table";

import { VisitChart } from "./VisitChart";

export const getStringMonth = (month: number) => {
  return format(new Date(0, month - 1), "MMMM");
};

const page = async ({ params }: { params: { commercialId: string } }) => {
  const commercial = await prisma.user.findFirst({
    where: {
      id: params.commercialId,
    },
    include: {
      visits: {
        include: {
          pos: true,
          disponibilities: true,
        },
      },
      Notification: true,
    },
  });
  if (!commercial) {
    notFound();
  }

  const dbVisitisPerMonth = await prisma.visit.findMany({
    where: {
      userId: commercial.id,
    },
  });
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const visitsPerMonth = months.map((month) => ({
    month,
    count: dbVisitisPerMonth.filter(
      (visit) => visit.createdAt.getMonth() + 1 === month,
    ).length,
  }));
  const visits = visitsPerMonth.map((visit) => ({
    month: getStringMonth(visit.month),
    count: visit.count,
  }));

  return (
    <>
      <DashboardHeader
        heading={commercial.name ?? "Commercial"}
        text={`${commercial.states.join(", ") ?? ""}`}
      >
        <span className="flex items-center rounded-md bg-purple-500/10 px-2 py-1 font-semibold text-purple-800">
          <MdScore className="mr-2 size-4" />
          Score du mois : <span className="font-bold">10</span>
        </span>
      </DashboardHeader>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 rounded-md p-4">
          <h3 className="text-lg font-semibold">Visites</h3>
          <DataTable data={commercial.visits} />
        </div>
        <div className="col-span-1 rounded-md p-4">
          <h3 className="text-lg font-semibold">Dernière Notification</h3>
          <div className="mt-4 max-h-[400px] space-y-4 overflow-y-auto">
            {commercial.Notification.length > 0 ? (
              commercial.Notification.map((notification) => (
                <Alert className="border-gray-400">
                  <Bell className="h-4 w-4" />
                  <AlertTitle>
                    {notification.description}{" "}
                    {notification.type === NotificationType.ADDED_VISIT ? (
                      <Badge
                        variant="outline"
                        className="ml-2 bg-blue-100 text-blue-800"
                      >
                        Visite
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="ml-2 bg-green-100 text-green-800"
                      >
                        Point de vente
                      </Badge>
                    )}
                  </AlertTitle>
                  <AlertDescription>{notification.message}</AlertDescription>
                  <Link
                    href={notification.actionLink ?? ""}
                    className="mt-2 text-primary underline"
                  >
                    Voir
                  </Link>
                </Alert>
              ))
            ) : (
              <p>Aucune notification</p>
            )}
          </div>
        </div>
        <div className="col-span-2 p-4">
          <VisitChart visits={visits} />
        </div>
        <div className="col-span-1 rounded-md p-4">
          <h3 className="text-lg font-semibold">Commentaires des clients</h3>
          <div className="mt-4 space-y-4">
            {commercial.visits
              .filter((visit) => visit.note)
              .map((visit) => (
                <div key={visit.id} className="border-b border-gray-200 py-2">
                  <p>{visit.note}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    {format(visit.createdAt, "dd/MM/yyyy")}
                  </p>
                  <Link
                    href={`/dashboard/visits/${visit.id}`}
                    className="mt-1 text-xs text-gray-500 underline"
                  >
                    Voir la visite
                  </Link>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
