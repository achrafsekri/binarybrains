import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { invoiceFormContext } from "@/app/(protected)/dashboard/invoices/create/CreateInvoiceForm";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";

export default function TermsAndPaymenModal({
  showModal,
  setShowModal,
}: {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}) {
  const form = useContext(invoiceFormContext);
  const [bankDetails, setBankDetails] = useState(
    form?.getValues("InvoiceDetails.paymentDetails") || "",
  );
  useEffect(() => {
    form?.setValue("InvoiceDetails.paymentDetails", bankDetails);
  }, [bankDetails, form]);
  return (
    <Modal
      className="max-h-[90vh] max-w-2xl overflow-y-auto p-4"
      showModal={showModal}
      setShowModal={setShowModal}
    >
      <h2 className="text-left text-2xl font-bold">Modifier les Reglements</h2>
      <hr className="my-4" />
      <div className="w-full space-y-4 px-2">
        <FormField
          control={form!.control}
          name="InvoiceDetails.paymentMethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Methode de payement</FormLabel>
              <FormControl>
                <Textarea
                  value={field.value as string}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form!.control}
          name="InvoiceDetails.paymentDetails"
          render={() => (
            <FormItem>
              <FormLabel>Details du compte bancaire</FormLabel>
              <FormControl>
                <Textarea
                 defaultValue={bankDetails.split("%n%").join("\n")}
                  onChange={(e) => setBankDetails(e.target.value.split("\n").join("%n%"))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form!.control}
          name="InvoiceDetails.legalMentions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mentions legales</FormLabel>
              <FormControl>
                <Textarea
                  value={field.value as string}
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
