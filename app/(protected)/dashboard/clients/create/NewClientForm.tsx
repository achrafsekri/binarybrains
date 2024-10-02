"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { redirect } from 'next/navigation'
import { toast } from "@/components/ui/use-toast";

const customerSchema = z.object({
  name: z.string().min(1, { message: "Le nom est requis" }),
  address: z.string().min(1, { message: "L'adresse est requise" }),
  siret: z.string().nullable(),
  phone: z.string().nullable(),
  email: z.string().email({ message: "Adresse e-mail invalide" }).nullable(),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

export default function NewClientForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    // Here you would typically send the form data to your backend
    // For this example, we'll just simulate a submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log(data);
    toast({
      title: "Client ajouté",
      description: "Le nouveau client a été créé avec succès.",
    });

    setIsSubmitting(false);
    form.reset();
    redirect("/dashboard/clients");
  };

  return (
    <main className="w-full bg-background p-4 px-16">
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
                    {...field}
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
                    {...field}
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
                    {...field}
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
                    {...field}
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
                    {...field}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Création en cours..." : "Créer le client"}
          </Button>
        </form>
      </Form>
    </main>
  );
}
