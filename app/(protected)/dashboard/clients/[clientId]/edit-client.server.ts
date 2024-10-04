"use server";

import { Customer, User } from "@prisma/client";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { logger } from "@/lib/logger";

export const editCustomer = async (
  customerId: string,
  payload: Partial<Customer>,
) => {
  const user = await getCurrentUser();
  try {
    if (!user) throw new Error("Unauthorized");
    const edit = await prisma.customer.update({
      where: { id: customerId },
      data: payload,
    });
    return { ok: true };
  } catch (error) {
    logger.error("Error editing customer", error);
    return { ok: false };
  }
};
