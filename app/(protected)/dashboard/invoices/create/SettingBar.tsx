"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { sendEmail } from "@/actions/send-email.server";
import { InvoiceEmail } from "@/emails/invoice-email";
import InvoiceTemplateA from "@/pdf/InvoiceTemplateA";
import { render } from "@react-email/components";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import { Download, Printer, Send } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { custom, z } from "zod";

import { InvoiceWithRelations } from "@/types/invoice-with-relations";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

import { invoiceFormContext, invoiceFormSchema } from "./CreateInvoiceForm";
import { createInvoice } from "./invoice-server";

export default function SettingBar() {
  const router = useRouter();
  const form = useContext(invoiceFormContext);
  form?.watch("Settings");

  const [CustomerEmail, setCustomerEmail] = useState<string | null>(
    form?.getValues("ClientDetails.email") ?? null,
  );
  const isSubmitting = form?.formState.isSubmitting;

  useEffect(() => {
    setCustomerEmail(form?.getValues("ClientDetails.email") ?? null);
  }, [form?.getValues("ClientDetails.email")]);

  async function onSubmit(values: z.infer<typeof invoiceFormSchema>) {
    try {
      const res = await createInvoice(values);
      if (res.ok) {
        const blob = await pdf(
          <InvoiceTemplateA invoice={res.invoice as InvoiceWithRelations} />,
        ).toBlob();
        saveAs(blob, "facture.pdf");
        toast.success("La facture a été créé avec succès");
        router.push("/dashboard/invoices");
      } else {
        toast.error(res.message);
      }
    } catch (e) {
      toast.error(
        "Une erreur s'est produite lors de la création de la facture",
      );
    }
  }

  async function sendInvoiceEmail(values: z.infer<typeof invoiceFormSchema>) {
    try {
      if (!CustomerEmail) {
        toast.error("Veuillez entrer un email valide");
        return;
      }
      const res = await createInvoice(values);
      if (res.ok) {
        const link = `${process.env.NEXT_PUBLIC_APP_URL}/invoices/${res.invoice?.id}`;
        const html = await render(
          <InvoiceEmail
            senderName={res.invoice?.seller.name ?? ""}
            documentLink={link}
            receiverName={res.invoice?.customer.name ?? ""}
            type="FACTURE"
          />,
        );

        await sendEmail(
          html,
          `${res.invoice?.seller.name} vous a envoyé une facture`,
          CustomerEmail ?? "",
        );
        toast.success("La facture a été créé et envoyé avec succès");
        router.push("/dashboard/invoices");
      } else {
        toast.error(res.message);
      }
    } catch (e) {
      toast.error(
        "Une erreur s'est produite lors de la création de la facture",
      );
    }
  }

  return (
    <Card className="z-10 h-fit lg:sticky lg:top-16 lg:mx-auto lg:max-w-md">
      <CardHeader>
        <CardTitle className="text-lg font-bold lg:text-2xl">
          Réglages
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm md:text-base">
        <FormField
          control={form?.control}
          name="Settings.vatActivated"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="activate-vat" className="text-sm font-medium">
                  Activer la TVA
                </Label>
                <Switch
                  id="activate-vat"
                  checked={field.value}
                  onCheckedChange={(e) => field.onChange(e)}
                />
              </div>
            </FormItem>
          )}
        />
        <hr className="my-6" />
        <FormField
          control={form?.control}
          name="Settings.vatPerItem"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="variable-vat" className="text-sm font-medium">
                  Taux TVA variable par ligne
                </Label>
                <Switch
                  id="variable-vat"
                  checked={field.value}
                  onCheckedChange={(e) => field.onChange(e)}
                />
              </div>
            </FormItem>
          )}
        />
        <hr className="my-6" />

        <FormField
          control={form?.control}
          name="Settings.vatRate"
          render={({ field }) => (
            <FormItem
              className={cn(
                "",
                (form?.getValues("Settings.vatPerItem") ||
                  !form?.getValues("Settings.vatActivated")) &&
                  "hidden",
              )}
            >
              <Label htmlFor="vat-rate" className="text-sm font-medium">
                Taux TVA
              </Label>
              <Input
                id="vat-rate"
                type="number"
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                className="w-full"
              />
            </FormItem>
          )}
        />
        <hr className="my-6" />
        <FormField
          control={form?.control}
          name="Settings.showQuantity"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between gap-2">
                <Label
                  htmlFor="activate-quantity"
                  className="text-sm font-medium"
                >
                  Activer la colonne &quot;Quantité&quot;
                </Label>
                <Switch
                  id="activate-quantity"
                  checked={field.value}
                  onCheckedChange={(e) => field.onChange(e)}
                />
              </div>
            </FormItem>
          )}
        />
        <hr className="my-6" />
        <FormField
          control={form?.control}
          name="Settings.showUnit"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="activate-unit" className="text-sm font-medium">
                  Activer la colonne &quot;Unité&quot;
                </Label>
                <Switch
                  id="activate-unit"
                  checked={field.value}
                  onCheckedChange={(e) => field.onChange(e)}
                />
              </div>
            </FormItem>
          )}
        />
        <hr className="my-6" />
        <FormField
          control={form?.control}
          name="Settings.devise"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="currency" className="text-sm font-medium">
                Devise
              </Label>
              <Select
                onValueChange={(value) => field.onChange(value)}
                defaultValue={field.value}
                value={field.value}
              >
                <SelectTrigger id="currency">
                  <SelectValue placeholder="Sélectionnez une devise" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="€">Euro (€)</SelectItem>
                  <SelectItem value="$">Dollar ($)</SelectItem>
                  <SelectItem value="£">Livre Sterling (£)</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <Dialog>
          <DialogTrigger asChild>
            <Button className="mt-8 w-full" variant="outline">
              <Download className="mr-2 size-4" />
              Sauvegarder
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Sauvegarder ou envoyer la facture</DialogTitle>
            </DialogHeader>
            <DialogContent>
              <h2 className="text-lg font-bold">Sauvegarder la facture</h2>
              <p className="-mt-2 text-sm text-gray-500">
                Téléchargez la facture en format PDF
              </p>
              <ConnectForm>
                {({ handleSubmit }: any) => (
                  <>
                    <Button
                      className="font-white bg-primary hover:bg-primary/80"
                      type="button"
                      disabled={isSubmitting}
                      onClick={handleSubmit(onSubmit)}
                    >
                      <Download className="mr-2 size-4" />
                      {isSubmitting ? "En cours..." : "Télécharger"}
                    </Button>
                  </>
                )}
              </ConnectForm>
              <div className="flex items-center gap-4 text-sm font-light text-gray-400">
                <hr className="my-4 w-full" />
                Ou
                <hr className="my-4 w-full" />
              </div>
              <h2 className="text-lg font-bold">Envoyer la facture</h2>
              <p className="-mt-2 text-sm text-gray-500">
                Envoyez la facture par email à votre client
              </p>
              <Input
                type="email"
                placeholder="Email du client"
                className="w-full"
                value={CustomerEmail ?? ""}
                onChange={(e) => setCustomerEmail(e.target.value)}
              />
              <ConnectForm>
                {({ handleSubmit }: any) => (
                  <>
                    <Button
                      className="font-white bg-primary hover:bg-primary/80"
                      type="button"
                      disabled={isSubmitting}
                      onClick={handleSubmit(sendInvoiceEmail)}
                    >
                      <Send className="mr-2 size-4" />
                      {isSubmitting ? "En cours..." : "Envoyer"}
                    </Button>
                  </>
                )}
              </ConnectForm>
            </DialogContent>
            {/* <DialogFooter>
              <div className="flex justify-center space-x-4">
                <ConnectForm>
                  {({ handleSubmit }: any) => (
                    <>
                      <Button
                        className="font-white bg-primary hover:bg-primary/80"
                        type="button"
                        disabled={isSubmitting}
                        onClick={handleSubmit(onSubmit)}
                      >
                        <Download className="mr-2 size-4" />
                        {isSubmitting ? "En cours..." : "Télécharger"}
                      </Button>
                    </>
                  )}
                </ConnectForm>
                <Button
                  disabled={isSubmitting}
                  className="font-white bg-primary hover:bg-primary/80"
                >
                  <Send className="mr-2 size-4" />
                  Envoyer
                </Button>
              </div>
            </DialogFooter> */}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

export const ConnectForm = ({ children }: any) => {
  const methods = useFormContext();

  return children({ ...methods });
};
