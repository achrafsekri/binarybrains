"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

import { prisma } from "@/lib/db";

export const uploadFilesToServer = async (
  taskId: string,
  files: {
    name: string;
    url: string;
    id: string;
    type: string;
  }[],
) => {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }
  const user = session.user;
  try {
    // upload multiple assets to the server
    await prisma.milestone.update({
      where: { id: taskId },
      data: {
        Assets: {
          create: files.map((file) => ({
            name: file.name,
            type: file.type.includes("image")
              ? "IMAGE"
              : file.type.includes("video")
                ? "VIDEO"
                : file.type.includes("audio")
                  ? "AUDIO"
                  : "DOCUMENT",
            Project: {
              connect: {
                id: user.currentProjectId,
              },
            },
            url: file.url.split("?")[0],
          })),
        },
      },
    });
    revalidatePath("/dashboard/scope-of-work");
    return "All files uploaded successfully";
  } catch (error) {
    console.error("Some files failed to upload", error);
    throw new Error("Some files failed to upload");
  }
};
