"use server";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function deleteInvoice(invoiceId: string) {
  const user = await getCurrentUser();
  if (!user) {
    return { ok: false, error: "User not found" };
  }
  try {
    await prisma.invoice.delete({
      where: { id: invoiceId },
    });
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}
