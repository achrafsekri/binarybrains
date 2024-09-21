"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { taskSchema } from "@/app/(protected)/dashboard/invoices/task-content";

export async function UpdateDeliverable(
  id: string,
  data: z.infer<typeof taskSchema>,
) {
  const session = await auth();
  if (!session?.user.id) {
    throw new Error("Unauthorized");
  }
  try {
    session.user.currentProjectId;
    await prisma.task.update({
      where: {
        id: id,
      },
      data: {
        ...data,
      },
    });

    revalidatePath("/dashboard/scope-of-work");

    return { status: "success" };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to save project");
  }
}
