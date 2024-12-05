"use server";

import { auth } from "@/auth";

import { prisma } from "@/lib/db";

import { VisitFormValues } from "./NewVistForm";

export const createVisit = async (visit: VisitFormValues) => {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  try {
    await prisma.visit.create({
      data: {
        lat: visit.lat,
        lng: visit.lng,
        posId: visit.posId,
        validated: visit.validated,
        note: visit.note,
        file: visit.file,
        userId: session.user.id as string,
        disponibilities: {
          create: visit.disponibilities.map((disponibility) => ({
            ...disponibility,
          })),
        },
      },
    });
  } catch (error) {
    throw error;
  }
};
