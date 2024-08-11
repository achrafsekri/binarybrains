"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

import { prisma } from "@/lib/db";
import { generateSlug } from "@/lib/utils";

export type Data = {
  name: string;
  description: string;
  color: string;
  criteriaForSuccess: string;
  deadline: Date | null;
  passCode: string;
};
export async function createProject(data: Data) {
  const session = await auth();
  if (!session?.user.id) {
    throw new Error("Unauthorized");
  }
  try {
    const projectId = randomUUID();
    const createdProject = await prisma.userProject.create({
      data: {
        User: {
          connect: {
            id: session.user.id,
          },
        },
        Project: {
          create: {
            id: projectId,
            name: data.name,
            description: data.description,
            slug: `${generateSlug(data.name)}-${randomUUID().slice(0, 4)}`,
            color: data.color || "#363c54",
            criteriaForSuccess: data.criteriaForSuccess,
            deadline: data.deadline,
            passCode: data.passCode,
          },
        },
      },
    });
    if (!createdProject) {
      throw new Error("Failed to create project");
    }

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
