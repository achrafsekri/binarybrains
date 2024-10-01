import {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { signIn } from "next-auth/react";

import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { invoiceFormContext } from "@/app/(protected)/dashboard/invoices/create/CreateInvoiceForm";

import SellerInfoForm from "../forms/seller-info-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

export default function EditSellerInfoModal({
  showModal,
  setShowModal,
}: {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}) {
  const form = useContext(invoiceFormContext);
  return (
    <Modal
      className="max-w-2xl p-4"
      showModal={showModal}
      setShowModal={setShowModal}
    >
      <h2 className="text-left text-2xl font-bold">
        Modifier les informations du vendeur
      </h2>
      <hr className="my-4" />
      <div className="w-full px-2 space-y-4 overflow-y-auto">
        <FormField
          control={form!.control}
          name="SellerDetails.name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom</FormLabel>
              <FormControl>
                <Input placeholder="Nom du vendeur" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form!.control}
          name="SellerDetails.address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adresse</FormLabel>
              <FormControl>
                <Input placeholder="Adresse du vendeur" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form!.control}
          name="SellerDetails.siret"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SIRET</FormLabel>
              <FormControl>
                <Input placeholder="Numéro de SIRET" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form!.control}
          name="SellerDetails.phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Téléphone</FormLabel>
              <FormControl>
                <Input placeholder="Numéro de téléphone" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form!.control}
          name="SellerDetails.email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Adresse email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form!.control}
          name="SellerDetails.vatNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Numéro de TVA</FormLabel>
              <FormControl>
                <Input placeholder="Numéro de TVA" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </Modal>
  );
}
