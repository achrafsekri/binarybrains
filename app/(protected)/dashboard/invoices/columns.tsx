import * as React from "react";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { sendEmail } from "@/actions/send-email.server";
import { ReminderEmail } from "@/emails/reminder-email";
import {
  Customer,
  Invoice,
  invoiceStatus,
  Quote,
  Seller,
} from "@prisma/client";
import { render } from "@react-email/components";
import { ColumnDef } from "@tanstack/react-table";
import { isWithinInterval, parseISO } from "date-fns";
import {
  ArrowUpDown,
  Eye,
  MoreHorizontal,
  Pencil,
  Space,
  Trash,
} from "lucide-react";
import { toast } from "sonner";

import { InvoiceWithRelations } from "@/types/invoice-with-relations";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { updateInvoiceStatus } from "./create/invoice-server";
import { deleteInvoice as invoiceDelete } from "./delete-invoice.server";

export const columns: ColumnDef<InvoiceWithRelations>[] = [
  {
    id: "Selection",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "Nombre",
    header: "Nombre de facture",
    cell: ({ row }) => (
      <div className="capitalize">Facture°{row.original.number}</div>
    ),
  },

  {
    accessorKey: "Client",
    header: "Client",
    cell: ({ row }) => (
      <div className="lowercase">{row.original.customer.name}</div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",

    cell: ({ row }) => (
      <div className="lowercase">{row.original.customer.email}</div>
    ),
  },
  {
    accessorKey: "Status",
    header: () => <div className="">Statut de paiement</div>,
    cell: ({ row }) => {
      const status = row.original.status;

      return (
        <div className="text-sm font-medium sm:text-base">
          {status === "PAID" ? (
            <span className="inline-flex truncate rounded-full bg-green-100 px-1.5 py-0.5 text-green-800 sm:px-2 sm:py-1">
              Payée
            </span>
          ) : status === "PENDING" ? (
            <span className="inline-flex truncate rounded-full bg-yellow-100 px-1.5 py-0.5 text-yellow-800 sm:px-2 sm:py-1">
              En attente
            </span>
          ) : status === "CANCELED" ? (
            <span className="inline-flex truncate rounded-full bg-red-100 px-1.5 py-0.5 text-red-800 sm:px-2 sm:py-1">
              Annulée
            </span>
          ) : (
            <span className="inline-flex truncate rounded-full bg-gray-100 px-1.5 py-0.5 text-gray-800 sm:px-2 sm:py-1">
              Inconnu
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const formattedDate = new Date(
        row.original.createdAt,
      )?.toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      return <div className="lowercase">{formattedDate}</div>;
    },
    filterFn: (row, id, value) => {
      try {
        // Parse the filter dates
        const filterInterval = {
          start: value.from,
          end: value.to,
        };
        return isWithinInterval(row.original.createdAt, filterInterval);
      } catch (error) {
        console.error("Date filtering error:", error);
        return false;
      }
    },
  },
  {
    id: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      const status = invoiceStatus;
      const statusTranslator = {
        PAID: "Payée",
        PENDING: "En attente de paiement",
        CANCELED: "Annulée",
      };
      const ChangeStatus = async (status: invoiceStatus) => {
        try {
          const res = await updateInvoiceStatus(row.original.id, status);
          if (res) {
            toast.success("Statut mis à jour avec succès");
          } else {
            throw new Error("Erreur lors de la mise à jour du statut.");
          }
        } catch (error) {
          toast.error(
            "Erreur lors de la mise à jour du statut. Veuillez réessayer.",
          );
        }
      };
      const deleteInvoice = async () => {
        const res = await invoiceDelete(row.original.id);
        if (res.ok) {
          toast.success("Facture supprimée avec succès");
        } else {
          toast.error(
            "Erreur lors de la suppression de la facture. Veuillez réessayer.",
          );
        }
      };
      const sendNotice = async () => {
        const html = await render(
          <ReminderEmail
            senderName={row.original.seller.name}
            documentLink={`https://allofacture.com/documents/${row.original.id}?type=invoice`}
            receiverName={row.original.customer.name}
            type="FACTURE"
            dueDate={new Date(row.original.dueDate ?? "")?.toLocaleDateString(
              "fr-FR",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              },
            )}
            amount={`${row.original.total}${row.original.devise}`}
          />,
        );
        try {
          await sendEmail(
            html,
            `Rappel de paiement pour la facture n°${row.original.number}`,
            row.original.customer.email ?? "",
          );
          toast.success("Rappel envoyé avec succès");
        } catch (e) {
          console.log("ERROR", e);
          toast.error("Erreur lors de l'envoi du rappel. Veuillez réessayer.");
        }
      };
      return (
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer">
              <MoreHorizontal className="" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {row.original.status == "PENDING" && (
                <Dialog>
                  <DialogTrigger asChild>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onSelect={(e) => e.preventDefault()}
                    >
                      Changer le status
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        Changer la status de votre facture
                      </DialogTitle>
                    </DialogHeader>
                    <Select
                      defaultValue={status[row.original.status]}
                      onValueChange={ChangeStatus}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(status).map((status) => (
                          <SelectItem key={status} value={status}>
                            {statusTranslator[status]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </DialogContent>
                </Dialog>
              )}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onSelect={(e) => e.preventDefault()}
                  >
                    Envoyer un rappel
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Tu es sûr de vouloir envoyer un rappel pour cette facture
                      ?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Cette action ne peut pas être annulée.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction onClick={sendNotice}>
                      Envoyer
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onSelect={(e) => e.preventDefault()}
                  >
                    Supprimer
                  </DropdownMenuItem>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Tu es sûr de vouloir supprimer cette facture ?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Cette action ne peut pas être annulée.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={deleteInvoice}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      Supprimer
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
