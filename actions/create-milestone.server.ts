"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { CreateMilestoneFormSchema } from "@/components/forms/create-milestone";

export async function createMilestone(
  data: z.infer<typeof CreateMilestoneFormSchema>,
) {
  const session = await auth();
  if (!session?.user.id) {
    throw new Error("Unauthorized");
  }
  try {
    const currentProjectId = session.user.currentProjectId;
    await prisma.milestone.create({
      data: {
        name: data.title,
        visibility: data.visibility ? "PUBLIC" : "PRIVATE",
        content: data.content,
        projectId: currentProjectId,
        dueDate: data.dueDate,
        addWatermark: data.addWatermark,
      },
    });

    revalidatePath("/dashboard/scope-of-work");

    return { status: "success" };
  } catch (error) {
    console.log(error);
    throw new Error("Failed to create project");
  }
}
