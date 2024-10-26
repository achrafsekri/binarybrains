import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Customer } from "@prisma/client";
import { Plus, PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import {
  devisFormContext,
  userCustomers,
} from "@/app/(protected)/dashboard/quotes/create/CreateDevisForm";

import SellerInfoForm from "../forms/seller-info-form";
import { DialogTitle } from "../ui/dialog";
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

export default function EditDevisClientInfoModal({
  showModal,
  setShowModal,
}: {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}) {
  const form = useContext(devisFormContext);
  const clients = useContext(userCustomers);
  const [customer, setCustomer] = useState<Customer | null>(
    //@ts-expect-error
    form?.getValues("ClientDetails.id")
      ? clients?.find(
          (client) => client.id === form?.getValues("ClientDetails.id"),
        )
      : null,
  );
  useEffect(() => {
    if (customer) {
      form?.setValue("ClientDetails.id", customer.id);
      form?.setValue("ClientDetails.name", customer.name);
      form?.setValue("ClientDetails.address", customer.address);
      form?.setValue("ClientDetails.siret", customer.siret);
      form?.setValue("ClientDetails.phone", customer.phone);
      form?.setValue("ClientDetails.email", customer.email);
    } else {
      form?.setValue("ClientDetails.id", "");
      form?.setValue("ClientDetails.name", "");
      form?.setValue("ClientDetails.address", "");
      form?.setValue("ClientDetails.siret", "");
      form?.setValue("ClientDetails.phone", "");
      form?.setValue("ClientDetails.email", "");
    }
  }, [customer, form]);
  return (
    <Modal
      className="max-h-[90vh] max-w-2xl overflow-y-auto p-4"
      showModal={showModal}
      setShowModal={setShowModal}
    >
      <DialogTitle className="text-2xl font-bold">
        {" "}
        Modifier les informations du client{" "}
      </DialogTitle>

      {/* <hr className="my-4" /> */}
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
              {customer ? (
                <div> {customer?.name}</div>
              ) : (
                <div className="text-gray-400"> Nom du client </div>
              )}
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {clients?.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectGroup>
              <SelectItem value={" "} className="font-bold">
                Ajouter un nouveau client
              </SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-4 text-sm font-light text-gray-400">
            <hr className="my-4 w-full" />
            Ou
            <hr className="my-4 w-full" />
          </div>
        </>
      )}

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
                  disabled={customer ? true : false}
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
                  disabled={customer ? true : false}
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
                  disabled={customer ? true : false}
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
                  disabled={customer ? true : false}
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
                  disabled={customer ? true : false}
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
