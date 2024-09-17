"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function createNote(
  content: string,
  taskId: string,
  clientId?: string,
) {
  const session = await auth();
  if (!session?.user.id) {
    throw new Error("Unauthorized");
  }
  try {
    const currentProjectId = session.user.currentProjectId;

    await prisma.note.create({
      data: {
        Task: {
          connect: {
            id: taskId,
          },
        },
        User: {
          connect: {
            id: session.user.id,
          },
        },
        Client: {
          connect: {
            id: clientId,
          },
        },
        content,
        sender,
      },
    });

    revalidatePath("/dashboard/scope-of-work");

    return { status: "success" };
  } catch (error) {
    console.log(error);
    throw new Error("Failed to create note");
  }
}
