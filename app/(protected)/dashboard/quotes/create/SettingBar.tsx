import { useContext, useState } from "react";
import { Download, Printer } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

import { invoiceFormContext } from "./page";

export default function SettingBar() {
  const form = useContext(invoiceFormContext);

  form?.watch("Settings");

  return (
    <Card className="mx-auto h-fit w-full max-w-md sticky top-16 bg-white z-10">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Réglages</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={form?.control}
          name="Settings.vatActivated"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
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

        <FormField
          control={form?.control}
          name="Settings.vatPerItem"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
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

        <FormField
          control={form?.control}
          name="Settings.vatRate"
          render={({ field }) => (
            <FormItem
              className={cn(
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

        <FormField
          control={form?.control}
          name="Settings.showQuantity"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
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

        <FormField
          control={form?.control}
          name="Settings.showUnit"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
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

        <FormField
          control={form?.control}
          name="Settings.color"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="cell-color" className="text-sm font-medium">
                Couleur des cases
              </Label>
              <Select
                onValueChange={(value) => field.onChange(value)}
                defaultValue={field.value}
                value={field.value}
              >
                <SelectTrigger id="cell-color">
                  <SelectValue placeholder="Sélectionnez une couleur" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6b7280">Gris</SelectItem>
                  <SelectItem value="3b82f6">Bleu</SelectItem>
                  <SelectItem value="22c55e">Vert</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

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
        <div className=" flex justify-end space-x-4">
          <Button
            className="bg-primary font-white hover:bg-yellow-600"
            type="submit"
          >
            <Download className="mr-2 size-4" />
            Save
          </Button>
          <Button className="bg-primary font-white hover:bg-yellow-600">
            <Printer className="mr-2 size-4" />
            Print
          </Button>
        </div>
      </CardContent>

    </Card>
  );
}
