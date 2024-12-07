"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pos } from "@prisma/client";
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
import { PosSelector } from "@/components/dashboard/PosSelector";
import { DatePicker } from "@/components/shared/DatePicker";
import { DateTimePicker } from "@/components/shared/DateTimePicker";

import { createPlanning } from "./planing-server";

const customerSchema = z.object({
  name: z.string().min(1, { message: "Le nom est requis" }),
  date: z.date(),
  posId: z.string().min(1, { message: "Le point de vente est requis" }),
});

export type PlanFormValues = z.infer<typeof customerSchema>;

export default function NewPlaningForm({ pos }: { pos: Pos[] }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const form = useForm<PlanFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      date: new Date(),
      posId: "",
      name: "",
    },
  });

  const onSubmit = async (data: PlanFormValues) => {
    setIsSubmitting(true);
    try {
      const res = await createPlanning({ ...data });
      toast.success("Le nouveau planning a été créé avec succès.");
      form.reset();
      router.push("/dashboard/planning");
    } catch (error) {
      toast.error(
        "Erreur lors de la création du point de vente. Veuillez réessayer.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="w-full max-w-4xl bg-background p-4">
      <h1 className="mb-6 text-center text-2xl font-bold">
        Créer un nouveau planning
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
                <FormLabel>Titre</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Titre du planning"
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
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <DateTimePicker date={field.value} setDate={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="posId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Point de vente</FormLabel>
                <FormControl>
                  <PosSelector
                    disabled={isSubmitting}
                    pos={pos.map((pos) => ({
                      value: pos.id,
                      label: pos.nom,
                    }))}
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Création en cours..." : "Créer le planning"}
          </Button>
        </form>
      </Form>
    </main>
  );
}
