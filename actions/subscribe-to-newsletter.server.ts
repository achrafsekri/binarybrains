"use server";

import { prisma } from "@/lib/db";

export const subscribeToNewsletter = async (email: string) => {
  try {
    await prisma.newsLetter.create({
      data: {
        email,
      },
    });
    return { ok: true };
  } catch (error) {
    throw new Error("Failed to subscribe to newsletter");
  }
};
