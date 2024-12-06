"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";

export const banUser = async (userId: string) => {
  await prisma.user.update({
    where: { id: userId },
    data: { isBanned: true },
  });
  revalidatePath("/admin/commerciaux");
};
export const deleteUser = async (userId: string) => {
  await prisma.user.update({
    where: { id: userId },
    data: { isDeleted: true },
  });
  revalidatePath("/admin/commerciaux");
};
export const unbanUser = async (userId: string) => {
  await prisma.user.update({
    where: { id: userId },
    data: { isBanned: false },
  });
  revalidatePath("/admin/commerciaux");
};
