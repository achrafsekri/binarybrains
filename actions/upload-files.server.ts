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

    revalidatePath("/dashboard");
    return "All files uploaded successfully";
  } catch (error) {
    console.error("Some files failed to upload", error);
    throw new Error("Some files failed to upload");
  }
};
