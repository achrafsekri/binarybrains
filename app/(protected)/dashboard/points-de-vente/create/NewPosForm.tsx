"use client";

import { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Product, State } from "@prisma/client";
import { CheckCircle2, Loader2, MapPin, Plus, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Badge } from "@/components/ui/badge";
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
import { PosSelector } from "@/components/dashboard/PosSelector";
import { ProductSelector } from "@/components/dashboard/ProductSelector";

import { createPos } from "./pos-server";

const disponibilitySchema = z.object({
  productId: z.string(),
  disponibility: z.boolean().default(false),
  price: z.number(),
});

const customerSchema = z.object({
  name: z.string().min(1, { message: "Le nom est requis" }),
  state: z.string().min(1, { message: "Le nom est requis" }),
  city: z.string().min(1, { message: "La ville est requise" }),
  zip: z.string().min(1, { message: "Le code postal est requis" }),
  phone: z.string().nullable(),
  lat: z.string().nullable(),
  lng: z.string().nullable(),
  description: z.string().nullable(),
  disponibilities: z.array(disponibilitySchema).min(1, {
    message: "Au moins une disponibilité est requise",
  }),
  note: z.string().nullable(),
});

export type PosFormValues = z.infer<typeof customerSchema>;

export default function NewPosForm({ products }: { products: Product[] }) {
  const [isLocating, setIsLocating] = useState(false);
  const [locatedAddress, setLocatedAddress] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [disponibilities, setDisponibilities] = useState<{
    productId: string;
    price: number;
  }>({
    productId: "",
    price: 0,
  });
  const session = useSession();
  const userStates = session.data?.user.states;
  const router = useRouter();
  const form = useForm<PosFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: "",
      state: "",
      city: "",
      phone: "",
      zip: "",
      lat: "",
      lng: "",
      description: "",
      disponibilities: [],
      note: "",
    },
  });

  console.log(form.formState.errors);
  const onSubmit = async (data: PosFormValues) => {
    setIsSubmitting(true);
    try {
      await createPos({ ...data });
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

  const states = userStates?.length ? userStates : Object.values(State);

  useEffect(() => {
    if (form.getValues("lat") && form.getValues("lng")) {
      setLocatedAddress(
        `${form.getValues("city")}, ${form.getValues("state")} ${form.getValues("zip")}`,
      );
    }
  }, [form]);

  return (
    <main className="h-[calc(100vh-100px)] w-full max-w-4xl overflow-y-auto bg-background p-4">
      <h1 className="mb-6 text-center text-2xl font-bold">
        Créer un nouveau point de vente
      </h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6"
        >
          <h2 className="-mb-2 text-lg font-bold">
            Informations du point de vente
          </h2>
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
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Téléphone</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Téléphone du point de vente"
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
          {/* Fiche visite */}
          <h2 className="-mb-2 text-lg font-bold">Fiche visite</h2>

          <FormField
            control={form.control}
            name="disponibilities"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Disponibilités</FormLabel>
                <FormControl>
                  <div className="flex flex-col gap-2">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <ProductSelector
                          products={products.map((p) => ({
                            value: p.id,
                            label: p.name,
                            companyCode: p.company.code,
                            companyName: p.company.name,
                          }))}
                          value={disponibilities.productId}
                          onChange={(value) => {
                            setDisponibilities({
                              ...disponibilities,
                              productId: value,
                            });
                          }}
                        />
                        <Input
                          type="number"
                          value={disponibilities.price}
                          onChange={(e) => {
                            setDisponibilities({
                              ...disponibilities,
                              price: Number(e.target.value),
                            });
                          }}
                          className="w-24"
                        />
                        <Button
                          variant="outline"
                          type="button"
                          size="sm"
                          onClick={() => {
                            field.onChange([...field.value, disponibilities]);
                          }}
                        >
                          <Plus className="size-4" />
                        </Button>
                      </div>
                      <div className="min-h-28 w-full space-y-2 rounded-md border-2 border-dashed border-gray-300 p-2">
                        {field.value.map((d, index) => {
                          const product = products.find(
                            (p) => p.id === d.productId,
                          );
                          return (
                            <div className="relative flex h-10 w-full items-center space-x-2 rounded-md border border-gray-300 p-2">
                              <Badge variant="outline">
                                {product?.company.code}
                              </Badge>
                              <span className="">|</span>
                              <span className="text-sm">{product?.name}</span>
                              <span className="">|</span>
                              <span className="text-sm font-semibold">
                                {d.price}TND
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                type="button"
                                className="absolute right-2"
                                onClick={() => {
                                  field.onChange(
                                    field.value.filter((_, i) => i !== index),
                                  );
                                }}
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Commentaire</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Commentaire"
                    value={field.value as string}
                    onChange={field.onChange}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Création en cours..." : "Créer le point de vente"}
          </Button>
        </form>
      </Form>
    </main>
  );
}
