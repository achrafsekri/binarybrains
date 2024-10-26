"use client";

import { createContext, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Customer, Seller } from "@prisma/client";
import { addDays } from "date-fns";
import { useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { logger } from "@/lib/logger";
import { Form } from "@/components/ui/form";

import { createDevis } from "./devis-server";
import DevisInterface from "./DevisInterface";
import SettingBar from "./SettingBar";

export const devisFormSchema = z.object({
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

  DevisDetails: z.object({
    devisNumber: z.string(),
    startingDate: z.date().nullable(),
    deliveryDate: z.date().nullable(),
    dueDate: z.date().nullable(),
    subtotal: z.number(),
    vatRate: z.number().nullable(),
    vatAmount: z.number().nullable(),
    total: z.number().nullable(),
    comment: z.string().nullable(),
    paymentDate: z.string().nullable(),
  }),
});
export const devisFormContext = createContext<UseFormReturn<
  z.infer<typeof devisFormSchema>
> | null>(null);
export const userCustomers = createContext<Customer[] | null>(null);

export function CreateDevisForm({
  clients,
  seller,
  currentDevisNumber = "0000",
}: {
  clients: Customer[];
  seller: Seller;
  currentDevisNumber: string;
}) {
  const defaultDevisFormValues = {
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

    DevisDetails: {
      devisNumber: currentDevisNumber, // Default devis number
      startingDate: new Date(), // Default devis creation date
      deliveryDate: new Date(), // Default delivery date
      dueDate: addDays(new Date(), 7), // Default due date
      subtotal: 0, // Default subtotal
      vatRate: 20, // Default VAT rate
      vatAmount: 0, // Default VAT amount
      total: 0, // Default total amount
      comment: null, // Optional, default to null
      paymentDate: null, // Optional, default to null
    },
  };
  const form = useForm<z.infer<typeof devisFormSchema>>({
    resolver: zodResolver(devisFormSchema),
    defaultValues: { ...defaultDevisFormValues },
  });
  const errors = form.formState.errors;
  console.log("errors", errors);
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      toast.error(
        "Veuillez vérifier les informations du client et vos information pour les erreurs.",
      );
      logger.error("error", errors);
    }
  }, [errors]);

  async function onSubmit(values: z.infer<typeof devisFormSchema>) {
    try {
      const devis = await createDevis(values);
      if (devis) {
        toast.success("La facture a été créé avec succès");
      } else {
        toast.error("Erreur lors de la création de la facture");
      }
    } catch (e) {
      logger.error("error creating devis", e);
    }
  }
  return (
    <main>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:p-4"
        >
          <userCustomers.Provider value={clients}>
            <devisFormContext.Provider value={form}>
              <DevisInterface />
              <SettingBar />
            </devisFormContext.Provider>
          </userCustomers.Provider>
        </form>
      </Form>
    </main>
  );
}
