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
import { devisFormContext } from "@/app/(protected)/dashboard/quotes/create/CreateDevisForm";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";

export default function CommentsModal({
  showModal,
  setShowModal,
}: {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}) {
  const form = useContext(devisFormContext);
  const [comment, setComment] = useState(
    form?.getValues("DevisDetails.comment") || "",
  );
  useEffect(() => {
    form?.setValue("DevisDetails.comment", comment);
  }, [comment, form]);
  return (
    <Modal
      className="max-h-[90vh] max-w-2xl overflow-y-auto p-4"
      showModal={showModal}
      setShowModal={setShowModal}
    >
      <h2 className="text-left text-2xl font-bold">Modifier les commentaires</h2>
      <hr className="my-2" />
      <div className="w-full space-y-4 px-2">
        <FormField
          control={form!.control}
          name="DevisDetails.comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Commentaires </FormLabel>
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
