"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { CreateTaskFormSchema } from "@/components/forms/create-task";

export async function createTask(data: z.infer<typeof CreateTaskFormSchema>) {
  const session = await auth();
  if (!session?.user.id) {
    throw new Error("Unauthorized");
  }
  try {
    const currentProjectId = session.user.currentProjectId;
    const highestOrder = await prisma.task.findFirst({
      where: { milestoneId: data.milestone },
      orderBy: { order: "desc" },
      select: { order: true },
    });
    const newOrder = (highestOrder?.order ?? 0) + 1;
    await prisma.task.create({
      data: {
        name: data.title,
        description: data.description,
        visibility: data.visibility ? "PUBLIC" : "PRIVATE",
        content: data.content,
        projectId: currentProjectId,
        milestoneId: data.milestone,
        order: newOrder,
      },
    });

    revalidatePath("/dashboard/scope-of-work");

    return { status: "success" };
  } catch (error) {
    console.log(error);
    throw new Error("Failed to create project");
  }
}
