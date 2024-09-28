"use client";

import { useState } from "react";
import { sendEmail } from "@/actions/send-email.server";
import { subscribeToNewsletter } from "@/actions/subscribe-to-newsletter.server";
import { NewsletterWelcome } from "@/emails/subscriber-welcome";
import { zodResolver } from "@hookform/resolvers/zod";
import { render } from "@react-email/components";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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

import { Spinner } from "../ui/spinner";

const FormSchema = z.object({
  email: z.string().email({
    message: "Enter a valid email.",
  }),
});

export function NewsletterForm() {
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true);
    try {
      subscribeToNewsletter(data.email);

      const html = await render(
        <NewsletterWelcome unsubscribeUrl="https://www.allofacture.com/unsubscribe" />,
      );
      await sendEmail(
        html,
        "Bienvenue à la newsletter d'AlloFacture!",
        data.email,
      );
      toast.success("Thank you for subscribing!");
      form.reset();
      setLoading(false);
    } catch (error) {
      toast.error("Failed to subscribe to newsletter");
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-2 sm:max-w-sm"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>S&apos;abonner à notre newsletter</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  className="rounded-full px-4"
                  placeholder="janedoe@example.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" size="sm" rounded="full" className="px-4">
          {loading && <Spinner size="small" className="mr-2" />}
          {!loading ? "S'abonner" : "S'abonner..."}
        </Button>
      </form>
    </Form>
  );
}
