"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Company, Pos, Product } from "@prisma/client";
import clsx from "clsx";
import { CheckCircle2, Plus, Trash2 } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { PosSelector } from "@/components/dashboard/PosSelector";
import { ProductSelector } from "@/components/dashboard/ProductSelector";

import { createVisit } from "./visit.server";

const disponibilitySchema = z.object({
  productId: z.string(),
  disponibility: z.boolean().default(false),
  price: z.number(),
});

const customerSchema = z.object({
  validated: z.boolean().default(false),
  lat: z.string(),
  lng: z.string(),
  posId: z.string(),
  file: z.string().nullable(),
  disponibilities: z.array(disponibilitySchema),
  note: z.string().nullable(),
});

export type VisitFormValues = z.infer<typeof customerSchema>;

export type ProductType = Product & {
  company: Company;
};

const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
) => {
  // calculate in meters
  const R = 6371000; // Earth's radius in meters
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
};

export default function NewVisitForm({
  pos,
  products,
  posId,
}: {
  pos: Pos[];
  products: ProductType[];
  posId: string;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [disponibilities, setDisponibilities] = useState<{
    productId: string;
    price: number;
  }>({
    productId: "",
    price: 0,
  });
  const router = useRouter();
  const form = useForm<VisitFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      validated: false,
      lat: "",
      lng: "",
      posId: posId,
      file: null,
      disponibilities: [],
      note: null,
    },
  });

  const onSubmit = async (data: VisitFormValues) => {
    setIsSubmitting(true);
    if (data.validated === false) {
      toast.error("Veuillez valider votre visite.");
      return;
    }
    try {
      const res = await createVisit({ ...data });
      toast.success("La nouvelle visite a été créée avec succès.");
      form.reset();
      router.push("/dashboard/visits");
    } catch (error) {
      toast.error("Erreur lors de la création du client. Veuillez récessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleValidate = async () => {
    const choosenPos = pos.find((p) => p.id === form.getValues("posId"));
    if (!choosenPos) {
      toast.error("Veuillez sélectionner un point de vente.");
      return;
    }
    const posCoordinates = {
      lat: choosenPos.lat,
      lng: choosenPos.lng,
    };

    navigator.geolocation.getCurrentPosition((position) => {
      const myLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      form.setValue("lat", myLocation.lat.toString());
      form.setValue("lng", myLocation.lng.toString());
      const distance = calculateDistance(
        myLocation.lat,
        myLocation.lng,
        Number(posCoordinates.lat),
        Number(posCoordinates.lng),
      );
      if (distance > 50) {
        toast.error(
          "Vous êtes trop loin du point de vente. (" +
            distance.toFixed(2) +
            "m)",
        );
        return;
      } else {
        form.setValue("validated", true);
        toast.success(
          "Vous êtes à " + distance.toFixed(2) + "m du point de vente.",
        );
      }
    });
  };
  return (
    <main className="w-full max-w-4xl bg-background p-4">
      <h1 className="mb-6 text-center text-2xl font-bold">
        Créer une nouvelle visite
      </h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6"
        >
          <FormField
            control={form.control}
            name="posId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Point de vente</FormLabel>
                <FormControl>
                  <>
                    <PosSelector
                      pos={pos.map((p) => ({
                        value: p.id,
                        label: p.nom,
                      }))}
                      disabled={posId !== ""}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="validated"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valider ma visite</FormLabel>
                <FormControl>
                  <Button
                    variant="outline"
                    onClick={() => handleValidate()}
                    className={clsx(
                      "w-full",
                      field.value === true && "bg-green-500 text-white",
                    )}
                    disabled={field.value === true}
                    type="button"
                  >
                    {field.value === true ? (
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="size-4" />
                        Visite validée
                      </span>
                    ) : (
                      "Valider ma visite"
                    )}
                  </Button>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
            {isSubmitting ? "En cours..." : "Créer"}
          </Button>
        </form>
      </Form>
    </main>
  );
}
