"use server";

import { Customer, User } from "@prisma/client";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

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
    console.log(error);
    return { ok: false };
  }
};
