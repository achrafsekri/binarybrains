"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/session";

import { PlanFormValues } from "./NewPlaningForm";
import { prisma } from "@/lib/db";

export const createPlanning = async (values: PlanFormValues) => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");
    await prisma.plan.create({
      data: {
        name: values.name,
        posId: values.posId,
        date: values.date,
        userId: user.id || "",
      },
    });
    return { ok: true };
  } catch (error) {
    throw error;
  }
};
