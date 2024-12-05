"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";

export const markAsDone = async (planId: string) => {
  const plan = await prisma.plan.update({
    where: { id: planId },
    data: { isDone: true },
  });
  revalidatePath("/dashboard/planning");
  return plan;
};
