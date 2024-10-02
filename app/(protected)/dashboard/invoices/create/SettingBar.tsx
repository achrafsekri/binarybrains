import { useContext, useState } from "react";
import { Download, Printer, Send } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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

export default function SettingBar() {
  const form = useContext(invoiceFormContext);
  form?.watch("Settings");

  async function onSubmit(values: z.infer<typeof invoiceFormSchema>) {
    console.log("the values: ", values);
    toast.success("La facture a été créé avec succès");

    try {
      // const invoice = await createInvoice(values);
      // if (invoice) {
      //   toast.success("La facture a été créé avec succès");
      // } else {
      //   toast.error("Erreur lors de la création de la facture");
      // }
    } catch (e) {
      console.log(e);
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
          <DialogContent className="sm:max-w-[425px] ">
            <DialogHeader>
              <DialogTitle>Sauvegarder</DialogTitle>
              <DialogDescription>
                Vous pouvez choisir d&apos;enregistrer le PDF ou de l&apos;envoyer par
                e-mail.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <div className="flex justify-center space-x-4">
                <ConnectForm>
                  {({ handleSubmit }: any) => (
                    <>
                      <Button
                        className="font-white bg-primary hover:bg-primary/80"
                        type="button"
                        onClick={handleSubmit(onSubmit)}
                      >
                        <Download className="mr-2 size-4" />
                        Enregistrer
                      </Button>
                    </>
                  )}
                </ConnectForm>
                <Button className="font-white bg-primary hover:bg-primary/80">
                  <Send className="mr-2 size-4" />
                  Envoyer
                </Button>
              </div>
            </DialogFooter>
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
