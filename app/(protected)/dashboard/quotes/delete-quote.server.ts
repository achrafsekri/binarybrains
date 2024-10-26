"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function deleteQuote(quoteId: string) {
  const user = await getCurrentUser();
  if (!user) {
    return { ok: false, error: "User not found" };
  }
  try {
    await prisma.quote.delete({
      where: { id: quoteId },
    });
    revalidatePath("/dashboard/quotes");
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}
