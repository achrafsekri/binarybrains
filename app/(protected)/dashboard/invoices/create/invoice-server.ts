"use server";

import createCustomer from "@/actions/create-customer.server";
import createSeller from "@/actions/create-seller.server";
import customerExists from "@/actions/customer-exists.server";
import sellerExists from "@/actions/seller-exists.server";

import { QuoteForm } from "@/types/quote-form";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export const createInvoice = async (data: QuoteForm) => {
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

    const userId = user?.id as string;

    // Create or get the seller
    const existingSeller = await sellerExists(SellerDetails);

    const sellerId = existingSeller
      ? existingSeller.id
      : (await createSeller({ SellerDetails, userId })).id;

    // Create or get the customer
    const existingCustomer = await customerExists(ClientDetails);

    const customerId = existingCustomer
      ? existingCustomer.id
      : (await createCustomer(ClientDetails)).id;

    // Create Quote
    const quote = await prisma.invoice.create({
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
        vatActivated: Settings.vatActivated,
        vatPerItem: Settings.vatPerItem,
        devise: Settings.devise,
        number: InvoiceDetails.id,
        date: InvoiceDetails.startingDate as Date,
        userId: userId,
      },
    });

    return quote;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
