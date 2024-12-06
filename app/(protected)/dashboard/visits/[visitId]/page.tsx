import Link from "next/link";
import { notFound } from "next/navigation";
import clsx from "clsx";
import { format } from "date-fns";
import {
  Calendar,
  Check,
  FileText,
  MapPin,
  Store,
  User,
  X,
} from "lucide-react";

import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default async function Page({
  params,
}: {
  params: { visitId: string };
}) {
  const visit = await prisma.visit.findUnique({
    where: {
      id: params.visitId,
    },
    include: {
      disponibilities: {
        where: {
          disponibility: true,
        },
        include: {
          product: {
            include: {
              company: true,
            },
          },
        },
      },
      pos: true,
    },
  });

  const companies = await prisma.company.findMany();

  if (!visit) {
    notFound();
  }

  //group disponibilities by company
  const disponibilitiesByCompany = visit.disponibilities.reduce((acc, disp) => {
    acc[disp.product.company.code] = acc[disp.product.company.code] || [];
    acc[disp.product.company.code].push(disp);
    return acc;
  }, {});

  return (
    <div className="max-w-screen overflow-x-hidden">
      <Card className="h-[90vh] w-[95vw] overflow-y-auto md:w-full">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">Fiche de visite</CardTitle>
              <CardDescription>
                <div className="mt-2 flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Date de la visite :{" "}
                    {format(visit.createdAt, "dd/MM/yyyy , HH:mm")}
                  </span>
                </div>
              </CardDescription>
            </div>
            <Badge
              variant={"secondary"}
              className={clsx(
                visit.validated
                  ? "bg-green-700 text-white"
                  : "bg-red-700 text-white",
              )}
            >
              {visit.validated ? "Validée" : "En attente"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <h3 className="mb-2 text-lg font-semibold">Informations</h3>
              <div className="flex items-center space-x-2">
                <Store className="h-4 w-4" />
                <Link
                  href={`/dashboard/points-de-vente/${visit.pos.id}`}
                  className="hover:underline"
                >
                  {visit.pos.nom}
                </Link>
              </div>
              {visit.note && (
                <div className="mt-4">
                  <h4 className="mb-1 font-semibold">Note:</h4>
                  <p className="text-sm text-gray-600">{visit.note}</p>
                </div>
              )}
            </div>

            <div>
              <h3 className="mb-2 text-lg font-semibold">Disponibilities</h3>
              <div className="space-y-8">
                {Object.entries(disponibilitiesByCompany).map(
                  ([companyCode, disponibilities]) => (
                    <Card key={companyCode} className="p-4">
                      <CardTitle className="mb-4 text-base font-semibold">
                        {companies.find((c) => c.code === companyCode)?.name}
                      </CardTitle>
                      <CardDescription className="space-y-4">
                        {/* @ts-expect-error TODO: fix this */}
                        {disponibilities?.map((disp) => (
                          <Card key={disp.id}>
                            <CardContent className="flex items-center justify-between p-4">
                              <Badge variant={"outline"}>
                                {disp.product.company.code}
                              </Badge>
                              <span className="font-medium">
                                {disp.product.name}
                              </span>
                              <div className="flex items-center space-x-4">
                                <Badge
                                  variant={"outline"}
                                  className={clsx(
                                    disp.disponibility
                                      ? "bg-green-100 text-green-700"
                                      : "bg-red-100 text-red-700",
                                  )}
                                >
                                  {disp.disponibility ? (
                                    <Check className="mr-1 h-4 w-4" />
                                  ) : (
                                    <X className="mr-1 h-4 w-4" />
                                  )}
                                  {disp.disponibility
                                    ? "Disponible"
                                    : "Indisponible"}
                                </Badge>
                                <span className="font-semibold">
                                  {disp.price.toFixed(2)} TND
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </CardDescription>
                    </Card>
                  ),
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
