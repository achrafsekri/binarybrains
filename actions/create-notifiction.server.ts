"use server";

import { auth } from "@/auth";
import { NotificationType } from "@prisma/client";

import { prisma } from "@/lib/db";

export async function createNotification(
  subject: string,
  message: string,
  type: NotificationType,
  actionLink?: string,
) {
  const session = await auth();

  await prisma.notification.create({
    data: {
      message,
      description: subject,
      type,
      actionLink,
      userId: session?.user.id as string,
    },
  });
}
