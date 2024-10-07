"use client";

import { createContext } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Customer, Seller } from "@prisma/client";
import { addDays } from "date-fns";
import { useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { logger } from "@/lib/logger";
import { Form } from "@/components/ui/form";

import { createInvoice } from "./invoice-server";
import InvoiceInterface from "./InvoiceInterface";
import SettingBar from "./SettingBar";

export const invoiceFormSchema = z.object({
  SellerDetails: z.object({
    name: z.string(),
    address: z.string(),
    logo: z.string().nullable(),
    phone: z.string().nullable(),
    email: z.string().nullable(),
    siret: z.string().nullable(),
    vatNumber: z.string().nullable(),
  }),

  ClientDetails: z.object({
    id: z.string(),
    name: z.string(),
    address: z.string(),
    siret: z.string().nullable(),
    phone: z.string().nullable(),
    email: z.string().nullable(),
  }),

  ProductsList: z.array(
    z.object({
      name: z.string(),
      quantity: z.string(),
      unitPrice: z.string(),
      totalPrice: z.number(),
      vatRate: z.string().nullable(),
    }),
  ),

  Settings: z.object({
    vatActivated: z.boolean().default(true),
    vatPerItem: z.boolean().default(false),
    vatRate: z.number().default(20),
    devise: z.string().default("€"),
    color: z.string().default("Vert"), // Default box color
    showQuantity: z.boolean().default(true), // Activate quantity column
    showUnit: z.boolean().default(false), // Deactivate unit column
  }),

  InvoiceDetails: z.object({
    invoiceNumber: z.string(),
    startingDate: z.date().nullable(),
    deliveryDate: z.date().nullable(),
    dueDate: z.date().nullable(),
    subtotal: z.number(),
    vatRate: z.number().nullable(),
    vatAmount: z.number().nullable(),
    total: z.number().nullable(),
    paymentTerms: z.string().nullable(),
    paymentDetails: z.string().nullable(),
    legalMentions: z.string().nullable(),
    paymentDate: z.string().nullable(),
  }),
});
export const invoiceFormContext = createContext<UseFormReturn<
  z.infer<typeof invoiceFormSchema>
> | null>(null);
export const userCustomers = createContext<Customer[] | null>(null);
export function CreateInvoiceForm({
  clients,
  seller,
  currentInvoiceNumber = "0000",
}: {
  clients: Customer[];
  seller: Seller;
  currentInvoiceNumber: string;
}) {
  const defaultInvoiceFormValues = {
    SellerDetails: {
      logo: seller?.logo, // Default company logo
      name: seller?.name, // Default company name
      address: seller?.address, // Default company address
      phone: seller?.phone, // Default company phone
      email: seller?.email, // Default company email
      siret: seller?.siret, // Default SIRET number
      vatNumber: seller?.vatNumber, // Default VAT number
    },

    ClientDetails: {
      id: "", // Default client id
      name: "Nom du client", // Default client name
      address: "456 Client Street, Client City, Client Country", // Default client address
      siret: " 123 456 789 00000", // Optional field, default is null
      phone: "+1 987 654 321", // Default client contact
      email: "exemple@example.com", // Optional field, default is null
    },

    ProductsList: [
      {
        name: "", // Default product 1
        quantity: "", // Default quantity
        unitPrice: "", // Default unit price
        totalPrice: 0, // Default total price
        vatRate: "", // Optional VAT rate, default is 0
      },
    ],

    Settings: {
      vatActivated: true, // VAT not activated
      vatPerItem: false, // VAT per item not activated
      devise: "€", // Default currency is Euro
      vatRate: 20, // Default VAT rate
      color: "6b7280", // Default box color
      showQuantity: true, // Activate quantity column
      showUnit: false, // Deactivate unit column
    },

    InvoiceDetails: {
      invoiceNumber: currentInvoiceNumber, // Default invoice number
      startingDate: new Date(), // Default invoice creation date
      deliveryDate: new Date(), // Default delivery date
      dueDate: addDays(new Date(), 7), // Default due date
      subtotal: 1700, // Default subtotal
      vatRate: 20, // Default VAT rate
      vatAmount: 340, // Default VAT amount
      total: 2040, // Default total amount
      paymentTerms: "Par virement bancaire", // Optional, default to null
      paymentDetails: "IBAN : Votre IBAN", // Optional, default to null
      legalMentions:
        "En cas de retard de paiement, et conformément au code du commerce, une indemnité calculée sur la base de trois fois le taux d'intérêt légal ainsi que des frais de recouvrement de 40 euros sont dus.", // Optional, default to null
      paymentDate: null, // Optional, default to null
    },
  };
  const form = useForm<z.infer<typeof invoiceFormSchema>>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: { ...defaultInvoiceFormValues },
  });
  function OnError(error: any) {
    toast.error("An error ocured");
    logger.error("error", error);
  }
  async function onSubmit(values: z.infer<typeof invoiceFormSchema>) {
    try {
      const invoice = await createInvoice(values);
      if (invoice) {
        toast.success("La facture a été créé avec succès");
      } else {
        toast.error("Erreur lors de la création de la facture");
      }
    } catch (e) {
      logger.error("error creating invoice", e);
    }
  }
  return (
    <main>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, OnError)}
          className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:p-4"
        >
          <userCustomers.Provider value={clients}>
            <invoiceFormContext.Provider value={form}>
              <InvoiceInterface />
              <SettingBar />
            </invoiceFormContext.Provider>
          </userCustomers.Provider>
        </form>
      </Form>
    </main>
  );
}
