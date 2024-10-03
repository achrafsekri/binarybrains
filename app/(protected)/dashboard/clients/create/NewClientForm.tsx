"use client";

import { useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { createCustomer } from "./clients-server";

const customerSchema = z.object({
  name: z.string().min(1, { message: "Le nom est requis" }),
  address: z.string().min(1, { message: "L'adresse est requise" }),
  siret: z.string().nullable(),
  phone: z.string().nullable(),
  email: z.string().email({ message: "Adresse e-mail invalide" }).nullable(),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

export default function NewClientForm({
  hasAccess,
  user,
}: {
  hasAccess: boolean;
  user: User;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: "",
      address: "",
      siret: "",
      phone: "",
      email: "",
    },
  });

  const onSubmit = async (data: CustomerFormValues) => {
    setIsSubmitting(true);
    try {
      const res = await createCustomer(
        { ...data, userId: user.id },
        hasAccess,
        user,
      );
      toast.success("Le nouveau client a été créé avec succès.");
      form.reset();
      router.push("/dashboard/clients");
    } catch (error) {
      toast.error("Erreur lors de la création du client. Veuillez récessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="w-full max-w-4xl bg-background p-4">
      <h1 className="mb-6 text-center text-2xl font-bold">
        Créer un nouveau client
      </h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom complet</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Jean Dupont"
                    value={field.value as string}
                    onChange={field.onChange}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adresse</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="123 Rue de la Paix, 75000 Paris"
                    value={field.value as string}
                    onChange={field.onChange}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adresse e-mail</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="jean.dupont@example.com"
                    value={field.value as string}
                    onChange={field.onChange}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="siret"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Numéro SIRET</FormLabel>
                <FormControl>
                  <Input
                    placeholder="123 456 789 00012"
                    value={field.value as string}
                    onChange={field.onChange}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Numéro de téléphone</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="01 23 45 67 89"
                    value={field.value as string}
                    onChange={field.onChange}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || !hasAccess}
          >
            {!hasAccess
              ? "Accès non autorisé"
              : isSubmitting
                ? "Création en cours..."
                : "Créer le client"}
          </Button>
        </form>
      </Form>
    </main>
  );
}
