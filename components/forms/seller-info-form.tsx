import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

const editSellerInfoSchema = z.object({
  name: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  address: z.string().min(3, "L'adresse doit contenir au moins 3 caractères"),
  phone: z.string().nullable(),
  email: z.string().nullable(),
  siret: z.string().nullable(),
  vatNumber: z.string().nullable(),
});

const SellerInfoForm = () => {
  const form = useForm<z.infer<typeof editSellerInfoSchema>>({
    resolver: zodResolver(editSellerInfoSchema),
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      email: "",
      siret: "",
      vatNumber: "",
    },
  });

  const onSubmit = (data: z.infer<typeof editSellerInfoSchema>) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="An awesome milestone :)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default SellerInfoForm;
