"use server";

import { revalidatePath } from "next/cache";
import { invoiceStatus } from "@prisma/client";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { getCurrentUser } from "@/lib/session";

import { invoiceFormSchema } from "./CreateInvoiceForm";

export const createInvoice = async (
  data: z.infer<typeof invoiceFormSchema>,
) => {
  try {
    const {
      SellerDetails,
      ClientDetails,
      ProductsList,
      InvoiceDetails,
      Settings,
    } = data;
    // Get the current session to retrieve the user ID
    const user = await getCurrentUser();
    if (!user) {
      return { ok: false, error: "User not found" };
    }
    const userId = user?.id as string;

    // update the seller
    const seller = await prisma.seller.findFirst({
      where: { userId: userId },
    });

    if (!seller) {
      logger.error("Seller not found");
      return { ok: false, error: "Seller not found" };
    }

    await prisma.seller.update({
      where: { id: seller.id },
      data: { ...SellerDetails, userId: userId },
    });

    let customer;
    // update the customer
    if (!ClientDetails.id) {
      customer = await prisma.customer.create({
        data: { ...ClientDetails, userId: userId },
      });
    }

    // Create Quote
    await prisma.invoice.create({
      data: {
        sellerId: seller.id,
        customerId: ClientDetails.id ? ClientDetails.id : customer.id,
        items: {
          create: ProductsList.map((item) => ({
            description: item.name ?? "",
            name: item.name ?? "",
            quantity: parseInt(item.quantity) ?? 0,
            unitPrice: parseFloat(item.unitPrice) ?? 0,
            totalPrice: item.totalPrice ?? 0,
            totalVat: item.totalPrice ?? 0,
            vatRate: item.vatRate,
          })),
        },
        subtotal: InvoiceDetails.subtotal,
        vatRate: InvoiceDetails.vatRate,
        vatAmount: InvoiceDetails.vatAmount,
        total: InvoiceDetails.total,
        vatActivated: Settings.vatActivated,
        vatPerItem: Settings.vatPerItem,
        devise: Settings.devise,
        number: InvoiceDetails.invoiceNumber,
        date: InvoiceDetails.startingDate as Date,
        userId: userId,
        paymentDetails: InvoiceDetails.paymentDetails,
        paymentTerms: InvoiceDetails.paymentTerms,
        legalMentions: InvoiceDetails.legalMentions,
      },
    });
    logger.info("Invoice created successfully");
    revalidatePath("/dashboard/invoices");
    return { ok: true, message: "Invoice created successfully" };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateInvoiceStatus = async (
  invoiceId: string,
  status: invoiceStatus,
) => {
  try {
    const invoice = await prisma.invoice.update({
      where: { id: invoiceId },
      data: { status: status },
    });
    revalidatePath("/dashboard/invoices");
    return invoice;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
