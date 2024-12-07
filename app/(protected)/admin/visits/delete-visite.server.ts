"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";

export async function deleteVisitFunction(visitId: string) {
  const deletedVisit = await prisma.visit.delete({ where: { id: visitId } });
  revalidatePath("/dashboard/visits");
  return deletedVisit;
}
