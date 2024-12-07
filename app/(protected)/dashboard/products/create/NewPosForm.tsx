"use client";

import { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { State } from "@prisma/client";
import { CheckCircle2, Loader2, MapPin } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { createPos } from "./pos-server";

const customerSchema = z.object({
  name: z.string().min(1, { message: "Le nom est requis" }),
  state: z.string().min(1, { message: "Le nom est requis" }),
  city: z.string().min(1, { message: "La ville est requise" }),
  zip: z.string().min(1, { message: "Le code postal est requis" }),
  lat: z.string().nullable(),
  lng: z.string().nullable(),
  description: z.string().nullable(),
});

export type PosFormValues = z.infer<typeof customerSchema>;

export default function NewPosForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locatedAddress, setLocatedAddress] = useState<string | null>(null);
  const router = useRouter();
  const form = useForm<PosFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: "",
      state: "",
      city: "",
      zip: "",
      lat: "",
      lng: "",
      description: "",
    },
  });

  const onSubmit = async (data: PosFormValues) => {
    setIsSubmitting(true);
    try {
      const res = await createPos({ ...data });
      toast.success("Le nouveau point de vente a été créé avec succès.");
      form.reset();
      router.push("/dashboard/points-de-vente");
    } catch (error) {
      toast.error(
        "Erreur lors de la création du point de vente. Veuillez réessayer.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLocate = () => {
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        form.setValue("lat", position.coords.latitude.toString());
        form.setValue("lng", position.coords.longitude.toString());
        toast.success("Le point de vente a été localisé avec succès.");
      },
      (error) => {
        toast.error("Erreur lors de la localisation du point de vente.");
      },
    );
    setIsLocating(false);
  };

  const states = Object.values(State);

  useEffect(() => {
    if (form.getValues("lat") && form.getValues("lng")) {
      setLocatedAddress(
        `${form.getValues("city")}, ${form.getValues("state")} ${form.getValues("zip")}`,
      );
    }
  }, [form]);

  return (
    <main className="w-full max-w-4xl bg-background p-4">
      <h1 className="mb-6 text-center text-2xl font-bold">
        Créer un nouveau point de vente
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
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nom du point de vente"
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
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Description du point de vente"
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
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Etat</FormLabel>
                <FormControl>
                  <Select
                    value={field.value as string}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un état" />
                    </SelectTrigger>
                    <SelectContent>
                      {states?.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ville</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ville du point de vente"
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
              name="zip"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code postal</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Code postal du point de vente"
                      value={field.value as string}
                      onChange={field.onChange}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleLocate}
              disabled={isLocating}
            >
              {isLocating ? (
                <Loader2 size={16} className="mr-2 animate-spin" />
              ) : (
                <MapPin size={16} className="mr-2" />
              )}
              {isLocating
                ? "Localisation en cours..."
                : "Localiser le point de vente"}
            </Button>
            {locatedAddress && (
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-2">
                  Adresse localisée{" "}
                  <CheckCircle2 size={16} className="text-green-500" />
                </span>
              </div>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Création en cours..." : "Créer le point de vente"}
          </Button>
        </form>
      </Form>
    </main>
  );
}
