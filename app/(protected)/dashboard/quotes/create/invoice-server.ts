"use server";

import { QuoteForm } from "@/types/quote-form";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export const createQuote = async (data: QuoteForm) => {
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

    const userId = user?.id;

    // Create or get the seller
    const existingSeller = await prisma.seller.findFirst({
      where: {
        name: SellerDetails.name,
        address: SellerDetails.address,
        phone: SellerDetails.phone,
        siret: SellerDetails.siret,
      },
    });

    const sellerId = existingSeller
      ? existingSeller.id
      : (
          await prisma.seller.create({
            data: {
              name: SellerDetails.name ?? "",
              address: SellerDetails.address ?? "",
              phone: SellerDetails.phone ?? "",
              siret: SellerDetails.siret ?? "",
              email: SellerDetails.email ?? "",
              vatNumber: SellerDetails.vatNumber ?? "",
              userId: userId as string,
            },
          })
        ).id;

    // Create or get the customer
    const existingCustomer = await prisma.customer.findFirst({
      where: {
        name: ClientDetails.name,
        email: ClientDetails.email,
        siret: ClientDetails.siret,
      },
    });

    const customerId = existingCustomer
      ? existingCustomer.id
      : (
          await prisma.customer.create({
            data: {
              name: ClientDetails.name ?? "",
              email: ClientDetails.email ?? "",
              siret: ClientDetails.siret ?? "",
              address: ClientDetails.address ?? "",
              phone: ClientDetails.phone ?? "",
            },
          })
        ).id;

    // Create Quote
    const quote = await prisma.quote.create({
      data: {
        sellerId: sellerId,
        customerId: customerId,
        items: {
          create: ProductsList.map((item) => ({
            name: item.name ?? "",
            description: item.description ?? "",
            quantity: item.quantity ?? 0,
            unitPrice: item.unitPrice ?? 0,
            totalPrice: item.totalPrice ?? 0,
            totalVat: item.totalVat ?? 0,
            vatRate: item.vatRate ?? 0,
          })),
        },
        subtotal: InvoiceDetails.subtotal,
        vatRate: InvoiceDetails.vatRate,
        vatAmount: InvoiceDetails.vatAmount,
        total: InvoiceDetails.total,
        terms: InvoiceDetails.paymentTerms,
        notes: InvoiceDetails.legalMentions,
        status: "PENDING",
        vatActivated: Settings.vatActivated,
        vatPerItem: Settings.vatPerItem,
        devise: Settings.devise,
        number: InvoiceDetails.id,
        date: InvoiceDetails.startingDate as Date,
        validUntil: InvoiceDetails.dueDate as Date,
      },
    });

    return quote;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
