"use server";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function deleteInvoice(invoiceId: string) {
  const user = await getCurrentUser();
  if (!user) {
    return { ok: false, error: "User not found" };
  }
  try {
    await prisma.invoice.delete({
      where: { id: invoiceId },
    });
    revalidatePath("/dashboard/invoices");
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}
