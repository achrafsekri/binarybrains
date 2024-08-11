"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

import { prisma } from "@/lib/db";

export async function switchProject(projectId: string) {
  const session = await auth();
  if (!session?.user.id) {
    throw new Error("Unauthorized");
  }
  try {
    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        currentProjectId: projectId,
      },
    });

    revalidatePath("/dashboard");

    return { status: "success" };
  } catch (error) {
    console.log(error);
    throw new Error("Failed to create project");
  }
}
