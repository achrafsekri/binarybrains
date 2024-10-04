import * as React from "react";
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
import { revalidatePath } from "next/cache";

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
    accessorKey: "Téléphone",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Téléphone
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase">{row.original.customer.phone}</div>
    ),
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
      return (
        <div className="lowercase">
          {new Date(row.getValue("date")).toLocaleDateString("fr-FR")}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const start = new Date(value.from);
      const end = new Date(value.to);
      const startDate = start.getTime();
      const endDate = end.getTime();

      return (
        new Date(row.getValue("date")).getTime() >= startDate &&
        new Date(row.getValue("date")).getTime() <= endDate
      );
    },
  },
  {
    accessorKey: "date",
    header: "Date de création",

    cell: ({ row }) => {
      const formattedDate = new Date(
        row.original.createdAt,
      )?.toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      return <div className="capitalize">{formattedDate}</div>;
    },
    filterFn: (row, id, value) => {
      const start = new Date(value.from);
      const end = new Date(value.to);
      const startDate = start.getTime();
      const endDate = end.getTime();

      return (
        new Date(row.original.createdAt).getTime() >= startDate &&
        new Date(row.original.createdAt).getTime() <= endDate
      );
    },
  },

  {
    accessorKey: "Status",
    header: () => <div className="">Status</div>,
    cell: ({ row }) => {
      const status = row.original.status;

      return (
        <div className="font-medium">
          {status === "PAID" ? (
            <span className="rounded-full bg-green-100 px-2 py-1 text-green-800">
              Payée
            </span>
          ) : status === "PENDING" ? (
            <span className="rounded-full bg-yellow-100 px-2 py-1 text-yellow-800">
              En attente de paiement
            </span>
          ) : status === "CANCELED" ? (
            <span className="rounded-full bg-red-100 px-2 py-1 text-red-800">
              Annulée
            </span>
          ) : (
            <span className="rounded-full bg-gray-100 px-2 py-1 text-gray-800">
              Inconnu
            </span>
          )}
        </div>
      );
    },
  },
  {
    id: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      const status = invoiceStatus;
      const statusTranslator ={PAID:"Payée",PENDING:"En attente de paiement",CANCELED:"Annulée"}
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
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onSelect={(e) => e.preventDefault()}
                  >
                    Changer le status
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Changer la status de votre facture
                    </AlertDialogTitle>
                  </AlertDialogHeader>
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
                  <AlertDialogFooter>
                    <AlertDialogAction>Confirmer</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
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
