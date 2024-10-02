import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Customer } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import {
  invoiceFormContext,
  userCustomers,
} from "@/app/(protected)/dashboard/invoices/create/CreateInvoiceForm";

import SellerInfoForm from "../forms/seller-info-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function EditClientInfoModal({
  showModal,
  setShowModal,
}: {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const form = useContext(invoiceFormContext);
  const clients = useContext(userCustomers);
  useEffect(() => {
    if (customer) {
      form?.setValue("ClientDetails.name", customer.name);
      form?.setValue("ClientDetails.address", customer.address);
      form?.setValue("ClientDetails.siret", customer.siret);
      form?.setValue("ClientDetails.phone", customer.phone);
      form?.setValue("ClientDetails.email", customer.email);
    }
  }, [customer, form]);
  return (
    <Modal
      className="max-h-[90vh] max-w-2xl overflow-y-auto p-4"
      showModal={showModal}
      setShowModal={setShowModal}
    >
      <h2 className="text-left text-2xl font-bold">
        Modifier les informations du client
      </h2>
      <hr className="my-4" />
      {clients && clients.length > 0 && (
        <>
          <Label>Selectionner un client</Label>
          <Select
            key={(customer === null) + ""}
            onValueChange={(e) => {
              const SelectedCustomer = clients.find(
                (client) => client.id === e,
              );
              setCustomer(SelectedCustomer as Customer);
            }}
          >
            <SelectTrigger>
              {customer ? <div> {customer?.name}</div> : <div className="text-gray-400"> Nom du client </div>}
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {clients?.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </>
      )}
      <div className="flex items-center gap-4 text-sm font-light text-gray-400">
        <hr className="my-4 w-full" />
        Ou
        <hr className="my-4 w-full" />
      </div>
      <div className="w-full space-y-4 px-2">
        <FormField
          control={form!.control}
          name="ClientDetails.name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nom du client"
                  value={field.value as string}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    if (customer) {
                      setCustomer(null);
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form!.control}
          name="ClientDetails.address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adresse</FormLabel>
              <FormControl>
                <Input
                  placeholder="Adresse du client"
                  value={field.value as string}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    if (customer) {
                      setCustomer(null);
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form!.control}
          name="ClientDetails.siret"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SIRET</FormLabel>
              <FormControl>
                <Input
                  placeholder="Numéro de client"
                  value={field.value as string}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    if (customer) {
                      setCustomer(null);
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form!.control}
          name="ClientDetails.phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Téléphone</FormLabel>
              <FormControl>
                <Input
                  placeholder="Numéro de téléphone"
                  value={field.value as string}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    if (customer) {
                      setCustomer(null);
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form!.control}
          name="ClientDetails.email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="Adresse email"
                  value={field.value as string}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    if (customer) {
                      setCustomer(null);
                    }
                  }}
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
