"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { CreateDeliverableFormSchema } from "@/components/forms/create-deliverable";

export async function createDeliverable(
  data: z.infer<typeof CreateDeliverableFormSchema>,
) {
  const session = await auth();
  if (!session?.user.id) {
    throw new Error("Unauthorized");
  }
  try {
    const currentProjectId = session.user.currentProjectId;
    await prisma.task.create({
      data: {
        name: data.title,
        description: data.description,
        type: data.milestone ? "MILESTONE" : "TASK",
        visibility: data.visibility ? "PUBLIC" : "PRIVATE",
        content: data.content,
        projectId: currentProjectId,
      },
    });

    revalidatePath("/dashboard/scope-of-work");

    return { status: "success" };
  } catch (error) {
    console.log(error);
    throw new Error("Failed to create project");
  }
}
