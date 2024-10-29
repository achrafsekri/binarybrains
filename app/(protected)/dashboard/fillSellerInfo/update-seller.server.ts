"use server";

import { Seller } from "@prisma/client";

import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { getCurrentUser } from "@/lib/session";

export const updateSeller = async (seller: Partial<Seller>) => {
  const user = await getCurrentUser();
  try {
    await prisma.seller.upsert({
      where: { id: seller.id },
      update: seller as Seller,
      create: {
        ...(seller as Seller),
        userId: user?.id as string,
      },
    });
    return { ok: true, message: "Seller updated" };
  } catch (error) {
    logger.error("Error updating seller", error);
    return { ok: false, message: "Error updating seller" };
  }
};
