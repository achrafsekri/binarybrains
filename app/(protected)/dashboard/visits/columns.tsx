import * as React from "react";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { format, isWithinInterval } from "date-fns";
import { ArrowUpDown, Eye, MoreHorizontal, Pencil, Trash } from "lucide-react";
import { toast } from "sonner";

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

import { deleteVisitFunction } from "./delete-visite.server";
import { VisitWithDisponibilities } from "./page";

export const columns: ColumnDef<VisitWithDisponibilities>[] = [
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
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => (
      <div className="capitalize">
        {format(row.original.createdAt, "dd/MM/yyyy")}
      </div>
    ),
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
    accessorKey: "pos",
    header: "Point de vente",
    cell: ({ row }) => (
      <Link
        href={`/dashboard/points-de-vente/${row.original.pos.id}`}
        className="flex flex-col capitalize hover:underline"
      >
        <span className="font-medium">{row.original.pos.nom}</span>
        <span className="text-sm text-gray-500">{row.original.pos.state}</span>
      </Link>
    ),
    filterFn: (row, id, filterValue) => {
      return row.original.pos.nom
        .toLowerCase()
        .includes(filterValue.toLowerCase());
    },
  },

  {
    id: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      const deleteVisit = async () => {
        try {
          await deleteVisitFunction(row.original.id);
          toast.success("Visite supprimée avec succès");
        } catch (error) {
          console.error("Error deleting visit:", error);
          toast.error("Une erreur est survenue lors de la suppression");
        }
      };
      return (
        <div className="flex items-center">
          <Button variant="ghost" className="block">
            <Link href={`/dashboard/visits/${row.original.id}`}>
              <Eye className="size-5 text-gray-700" />
            </Link>
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost">
                <Trash className="size-5 text-primary" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Tu es sûr de vouloir supprimer cette visite ?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action ne peut pas être annulée.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction
                  onClick={deleteVisit}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    },
  },
];
