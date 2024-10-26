import * as React from "react";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { sendEmail } from "@/actions/send-email.server";
import { InvoiceEmail } from "@/emails/invoice-email";
import { ReminderEmail } from "@/emails/reminder-email";
import { QuoteStatus, Seller } from "@prisma/client";
import { render } from "@react-email/components";
import { ColumnDef } from "@tanstack/react-table";
import { isWithinInterval, parseISO } from "date-fns";
import {
  ArrowUpDown,
  CalendarClock,
  Eye,
  MoreHorizontal,
  Pencil,
  Send,
  Space,
  Trash,
} from "lucide-react";
import { MdSwitchAccessShortcut } from "react-icons/md";
import { toast } from "sonner";

import { QuoteWithRelations } from "@/types/quote-with-relations";
import { logger } from "@/lib/logger";
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

import { updateDevisStatus } from "./create/devis-server";
import { deleteQuote as deleteQuoteAction } from "./delete-quote.server";

export const columns: ColumnDef<QuoteWithRelations>[] = [
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
    header: "Nombre de devis",
    cell: ({ row }) => (
      <div className="capitalize">Devis°{row.original.number}</div>
    ),
    filterFn: (row, id, value) => {
      if (value === "" || value === undefined) return true;
      return row.original.number.includes(value);
    },
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
    filterFn: (row, id, value) => {
      if (value === "" || value === undefined) return true;
      return row.original.customer?.email?.includes(value) ?? false;
    },
  },
  {
    accessorKey: "Status",
    header: () => <div className="">Statut</div>,
    cell: ({ row }) => {
      const status = row.original.status;

      return (
        <div className="text-sm font-medium">
          {status === QuoteStatus.ACCEPTED ? (
            <span className="inline-flex truncate rounded-full bg-green-100 px-1.5 py-0.5 text-green-800 sm:px-2 sm:py-1">
              Acceptée
            </span>
          ) : status === QuoteStatus.PENDING ? (
            <span className="inline-flex truncate rounded-full bg-yellow-100 px-1.5 py-0.5 text-yellow-800 sm:px-2 sm:py-1">
              En attente
            </span>
          ) : status === QuoteStatus.REJECTED ? (
            <span className="inline-flex truncate rounded-full bg-red-100 px-1.5 py-0.5 text-red-800 sm:px-2 sm:py-1">
              Rejeté
            </span>
          ) : status === QuoteStatus.EXPIRED ? (
            <span className="inline-flex truncate rounded-full bg-gray-100 px-1.5 py-0.5 text-gray-800 sm:px-2 sm:py-1">
              Expiré
            </span>
          ) : (
            status
          )}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      if (value === "all") return true;
      return row.original.status === value;
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
      const status = QuoteStatus;
      const statusTranslator = {
        ACCEPTED: "Acceptée",
        PENDING: "En attente",
        EXPIRED: "Expirée",
        REJECTED: "Rejetée",

      };
      const ChangeStatus = async (status: QuoteStatus) => {
        try {
          const res = await updateDevisStatus(row.original.id, status);
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
      const deleteQuote = async () => {
        const res = await deleteQuoteAction(row.original.id);
        if (res.ok) {
          toast.success("Devis supprimé avec succès");
        } else {
          toast.error(
            "Erreur lors de la suppression du devis. Veuillez réessayer.",
          );
        }
      };
      const sendNotice = async () => {
        const html = await render(
          <ReminderEmail
            senderName={row.original.seller.name}
            documentLink={`${process.env.NEXT_PUBLIC_APP_URL}/quotes/${row.original.id}`}
            receiverName={row.original.customer.name}
            type="DEVIS"
            dueDate={new Date(
              row.original.validUntil ?? "",
            )?.toLocaleDateString("fr-FR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            amount={`${row.original.total}${row.original.devise}`}
          />,
        );
        try {
          await sendEmail(
            html,
            `Rappel de paiement pour le devis n°${row.original.number}`,
            row.original.customer.email ?? "",
          );
          toast.success("Rappel envoyé avec succès");
        } catch (e) {
          console.log("ERROR", e);
          toast.error("Erreur lors de l'envoi du rappel. Veuillez réessayer.");
        }
      };

      const sendQuote = async () => {
        try {
          const html = await render(
            <InvoiceEmail
              senderName={row.original.seller.name}
              documentLink={`${process.env.NEXT_PUBLIC_APP_URL}/quotes/${row.original.id}`}
              receiverName={row.original.customer.name}
              type="DEVIS"
            />,
          );

          await sendEmail(
            html,
            `${row.original.seller.name} vous a envoyé un devis`,
            row.original.customer.email ?? "",
          );
          toast.success("Devis envoyé avec succès");
        } catch (e) {
          logger.error("Error sending quote", e);
          toast.error("Erreur lors de l'envoi du devis. Veuillez réessayer.");
        }
      };

      return (
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer">
              <MoreHorizontal className="" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={(e) => e.preventDefault()}
              >
                <Link
                  href={`/quotes/${row.original.id}`}
                  target="_blank"
                  className="flex items-center"
                >
                  <Eye className="mr-2 size-4" />
                  Voire la devis
                </Link>
              </DropdownMenuItem>

              <Dialog>
                <DialogTrigger asChild>
                  <DropdownMenuItem
                    className="flex cursor-pointer items-center"
                    onSelect={(e) => e.preventDefault()}
                  >
                    <ArrowUpDown className="mr-2 size-4" />
                    Changer le status
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Changer la status de votre devis</DialogTitle>
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

              {row.original.status === "PENDING" && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem
                      className="flex cursor-pointer items-center"
                      onSelect={(e) => e.preventDefault()}
                    >
                      <Send className="mr-2 size-4" />
                      Envoyer la devis
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Tu es sûr de vouloir envoyer cette devis ?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Cette action ne peut pas être annulée.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction onClick={sendQuote}>
                        Envoyer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              {row.original.status === "PENDING" && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem
                      className="flex cursor-pointer items-center"
                      onSelect={(e) => e.preventDefault()}
                    >
                      <CalendarClock className="mr-2 size-4" />
                      Envoyer un rappel
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Tu es sûr de vouloir envoyer un rappel pour cette devis
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
              )}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    className="flex cursor-pointer items-center"
                    onSelect={(e) => e.preventDefault()}
                  >
                    <Trash className="mr-2 size-4" />
                    Supprimer
                  </DropdownMenuItem>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Tu es sûr de vouloir supprimer cette devis ?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Cette action ne peut pas être annulée.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={deleteQuote}
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
