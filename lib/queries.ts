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

export const getCurrentUserMilestones = async () => {
  try {
    const session = await auth();
    const currentProject = session?.user.currentProjectId;
    const milestones = await prisma.milestone.findMany({
      where: {
        projectId: currentProject,
      },
      include: {
        Tasks: {
          orderBy: {
            order: "asc",
          },
        },
        Assets: true,
        notes: true,
      },
      orderBy: {
        order: "asc",
      },
    });
    return milestones;
  } catch (error) {
    console.error(error);
    return [];
  }
};
