"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { z } from "zod";

import { prisma } from "@/lib/db";

export async function markAsComplete(type: "MILESTONE" | "TASK", id: string) {
  const session = await auth();
  if (!session?.user.id) {
    throw new Error("Unauthorized");
  }
  try {
    //using double if instead of else because we may add some other types in future
    if (type === "MILESTONE") {
      await prisma.milestone.update({
        where: { id },
        data: { status: "FINISHED" },
      });
    }
    if (type === "TASK") {
      await prisma.task.update({
        where: { id },
        data: { status: "FINISHED" },
      });
    }
    revalidatePath("/dashboard/scope-of-work");

    return { status: "success" };
  } catch (error) {
    console.log(error);
    throw new Error("Failed to create project");
  }
}
