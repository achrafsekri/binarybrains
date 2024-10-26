import { Dispatch, SetStateAction, useContext } from "react";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { devisFormContext } from "@/app/(protected)/dashboard/quotes/create/CreateDevisForm";

import { DialogTitle } from "../ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

export default function EditDevisSellerInfoModal({
  showModal,
  setShowModal,
}: {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}) {
  const form = useContext(devisFormContext);
  return (
    <Modal
      className="max-h-[90vh] max-w-2xl overflow-y-auto p-4"
      showModal={showModal}
      setShowModal={setShowModal}
    >
      <DialogTitle className="text-2xl font-bold">
        Modifier les informations du
        <br />
        vendeur
      </DialogTitle>
      <div className="w-full space-y-4 px-2">
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
                <Input
                  placeholder="Numéro de SIRET"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                />
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
                <Input
                  placeholder="Numéro de téléphone"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                />
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
                <Input
                  placeholder="Adresse email"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                />
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
                <Input
                  placeholder="Numéro de TVA"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button
            onClick={() => {
              setShowModal(false);
            }}
          >
            Enregistrer
          </Button>
        </div>
      </div>
    </Modal>
  );
}
