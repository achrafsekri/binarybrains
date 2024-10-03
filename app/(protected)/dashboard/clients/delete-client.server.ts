"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export const deleteCustomer = async (customerId: string) => {
  const user = await getCurrentUser();
  try {
    if (!user) throw new Error("Unauthorized");
    await prisma.customer.delete({
      where: { id: customerId },
    });
    revalidatePath("/dashboard/clients");
    return { ok: true };
  } catch (error) {
    console.log(error);
    return { ok: false };
  }
};
