import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PlusCircle } from "lucide-react";

import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/header";
import { FaDirections } from "react-icons/fa";
import { MdDirections } from "react-icons/md";

const page = async ({ params }: { params: { posId: string } }) => {
  const pos = await prisma.pos.findFirst({
    where: {
      id: params.posId,
    },
  });
  if (!pos) {
    notFound();
  }
  return (
    <>
      <DashboardHeader
        heading={pos.nom}
        text={`${pos.city ?? ""} - ${pos.state ?? ""}`}
      >
        <Button variant="outline" size="sm">
          <Link
            href={`https://www.google.com/maps/dir/?api=1&destination=${pos.lat},${pos.lng}`}
            target="_blank"
            className="flex items-center"
          >
            <MdDirections className="mr-2 size-4" />
            Obtenir un itinéraire
          </Link>
        </Button>
      </DashboardHeader>
    </>
  );
};

export default page;
