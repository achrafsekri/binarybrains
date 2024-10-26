"use server";

import { revalidatePath } from "next/cache";
import { QuoteStatus } from "@prisma/client";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { getCurrentUser } from "@/lib/session";

import { devisFormSchema } from "./CreateDevisForm";

export const createDevis = async (data: z.infer<typeof devisFormSchema>) => {
  try {
    const {
      SellerDetails,
      ClientDetails,
      ProductsList,
      DevisDetails,
      Settings,
    } = data;
    // Get the current session to retrieve the user ID
    const user = await getCurrentUser();
    if (!user) {
      return { ok: false, error: "User not found" };
    }
    const userId = user?.id as string;

    // update the seller
    let seller;
    seller = await prisma.seller.findFirst({
      where: { userId: userId },
    });

    if (!seller) {
      seller = await prisma.seller.create({
        data: { ...SellerDetails, userId: userId },
      });
    } else {
      seller = await prisma.seller.update({
        where: { id: seller.id },
        data: { ...SellerDetails, userId: userId },
      });
    }

    let customer;
    // update the customer
    if (!ClientDetails.id) {
      customer = await prisma.customer.create({
        data: {
          name: ClientDetails.name,
          address: ClientDetails.address,
          email: ClientDetails.email,
          phone: ClientDetails.phone,
          siret: ClientDetails.siret,
          userId: userId,
        },
      });
    }
    // Create the devis
    const createDevis = await prisma.quote.create({
      data: {
        sellerId: seller.id,
        customerId: ClientDetails.id ? ClientDetails.id : customer.id,
        items: {
          create: ProductsList.map((item) => ({
            description: item.name ?? "",
            name: item.name ?? "",
            quantity: parseInt(item.quantity) ?? 0,
            unitPrice: parseFloat(item.unitPrice) ?? 0,
            totalPrice: Number(item.totalPrice) ?? 0,
            totalVat: Settings.vatPerItem
              ? Number(item.totalPrice) * (Number(item.vatRate ?? 0) / 100)
              : 0,
            vatRate: Number(item.vatRate ?? 0),
          })),
        },
        subtotal: DevisDetails.subtotal,
        vatRate: Settings.vatActivated ? DevisDetails.vatRate : 0,
        vatAmount: Settings.vatActivated ? DevisDetails.vatAmount : 0,
        total: DevisDetails.total,
        vatActivated: Settings.vatActivated,
        vatPerItem: Settings.vatPerItem,
        devise: Settings.showUnit ? Settings.devise : "",
        showQuantity: Settings.showQuantity,
        number: DevisDetails.devisNumber,
        date: DevisDetails.startingDate as Date,
        userId: userId,
        validUntil: DevisDetails.dueDate as Date,
        comment: DevisDetails.comment,
      },
    });
    const devis = await prisma.quote.findUnique({
      where: { id: createDevis.id },
      include: {
        items: true,
        customer: true,
        seller: true,
      },
    });
    logger.info("Devis created successfully");
    revalidatePath("/dashboard/deviss");
    return { ok: true, message: "Devis created successfully", devis };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateDevisStatus = async (
  devisId: string,
  status: QuoteStatus,
) => {
  try {
    const devis = await prisma.quote.update({
      where: { id: devisId },
      data: { status: status },
    });
    revalidatePath("/dashboard/deviss");
    return devis;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
