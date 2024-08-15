import { auth } from "@/auth";

import { prisma } from "./db";

// *** prrojects ***
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

// *** tasks ***

export const getCurrentUserDeliverables = async () => {
  try {
    const session = await auth();
    const currentProject = session?.user.currentProjectId;
    const tasks = await prisma.task.findMany({
      where: {
        projectId: currentProject,
      },
    });
    return tasks;
  } catch (error) {
    console.error(error);
    return [];
  }
};
