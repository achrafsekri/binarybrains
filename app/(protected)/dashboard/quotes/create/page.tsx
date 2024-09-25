"use client";

import { createContext, useContext, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { uuid } from "uuidv4";
import { z } from "zod";

import { Form } from "@/components/ui/form";

import { createQuote } from "./invoice-server";
import InvoiceIntervace from "./InvoiceInterface";
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
    name: z.string(),
    address: z.string(),
    siret: z.string().nullable(),
    phone: z.string().nullable(),
    email: z.string().nullable(),
  }),

  ProductsList: z.array(
    z.object({
      name: z.string(),
      quantity: z.number(),
      unitPrice: z.number(),
      totalPrice: z.number(),
      vatRate: z.number().nullable(),
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
    id: z.string().uuid(),
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

export default function Page(props) {
  const defaultInvoiceFormValues = {
    SellerDetails: {
      logo: "jazjkaj",
      name: "Company Name", // Default company name
      address: "123 Company Street, City, Country", // Default company address
      phone: "+1 234 567 890", // Default phone number
      email: "3sTqI@example.com", // Optional, default to null
      siret: "123 456 789 00000", // Default SIRET number
      vatNumber: "FR12345678900", // Default VAT number
    },

    ClientDetails: {
      name: "John Doe", // Default client name
      address: "456 Client Street, Client City, Client Country", // Default client address
      siret: " 123 456 789 00000", // Optional field, default is null
      phone: "+1 987 654 321", // Default client contact
      email: "vLlTq@example.com", // Optional field, default is null
    },

    ProductsList: [
      {
        name: "Website Design", // Default product 1
        quantity: 1, // Default quantity
        unitPrice: 1000, // Default unit price
        totalPrice: 1000, // Default total price
        vatRate: 0, // Optional VAT rate, default is 0
      },
      {
        name: "Logo Design", // Default product 2
        quantity: 1, // Default quantity
        unitPrice: 500, // Default unit price
        totalPrice: 500, // Default total price
        vatRate: 0, // Optional VAT rate, default is 0
      },
      {
        name: "Hosting (per year)", // Default product 3
        quantity: 1, // Default quantity
        unitPrice: 200, // Default unit price
        totalPrice: 200, // Default total price
        vatRate: 0, // Optional VAT rate, default is null
      },
    ],

    Settings: {
      vatActivated: false, // VAT not activated
      vatPerItem: false, // VAT per item not activated
      devise: "€", // Default currency is Euro
      vatRate: 20, // Default VAT rate
      color: "6b7280", // Default box color
      showQuantity: true, // Activate quantity column
      showUnit: false, // Deactivate unit column
    },

    InvoiceDetails: {
      id: props.params.id,
      startingDate: new Date("2023-05-01"), // Default invoice creation date
      deliveryDate: new Date("2023-05-05"), // Default delivery date
      dueDate: new Date("2023-05-15"), // Default due date
      subtotal: 1700, // Default subtotal
      vatRate: 20, // Default VAT rate
      vatAmount: 340, // Default VAT amount
      total: 2040, // Default total amount
      paymentTerms: null, // Optional, default to null
      paymentDetails: null, // Optional, default to null
      legalMentions: null, // Optional, default to null
      paymentDate: null, // Optional, default to null
    },
  };
  const form = useForm<z.infer<typeof invoiceFormSchema>>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: { ...defaultInvoiceFormValues },
  });
  function OnError(error) {
    toast.error(JSON.stringify(error));

    console.log(error);
  }
  async function onSubmit(values: z.infer<typeof invoiceFormSchema>) {
    // const client = await createCustomer(values.ClientDetails);
    // console.log("waiting submit:", values);
    try {
      const quote = await createQuote(values);
      if (quote) {
        // toast.success("Quote created successfully");
        console.log("submitted", quote);
      } else {
        toast.error("Error creating quote");
      }
    } catch (e) {
      console.log(e);
    }
  }
  return (
    <main>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, OnError)}
          className="grid grid-cols-3 gap-4 p-4"
        >
          <invoiceFormContext.Provider value={form}>
            <InvoiceIntervace />
            <SettingBar />
          </invoiceFormContext.Provider>
        </form>
      </Form>
    </main>
  );
}
