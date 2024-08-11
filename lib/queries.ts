import { auth } from "@/auth";

import { prisma } from "./db";

export const getCurrentProject = async () => {
  try {
    const session = await auth();
    const currentProject = session?.user.currentProjectId;
    const project = await prisma.project.findFirst({
      where: {
        id: currentProject,
      },
    });
    return project;
  } catch (error) {
    console.error(error);
    return null;
  }
};
