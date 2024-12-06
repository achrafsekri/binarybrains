import * as React from "react";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { Ban, MoreHorizontal, Trash } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { UserWithRelations } from "./page";
import { banUser, deleteUser, unbanUser } from "./users.server";

export const columns: ColumnDef<UserWithRelations>[] = [
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
    accessorKey: "name",
    header: "nom",
    cell: ({ row }) => (
      <Link
        href={`/admin/commerciaux/${row.original.id}`}
        className="flex flex-col gap-1 lowercase"
      >
        <span className="font-bold">{row.original.name}</span>
      </Link>
    ),
    filterFn: (row, value) => {
      return (
        row.original.name?.toLowerCase().includes(value.toLowerCase()) || false
      );
    },
  },
  {
    accessorKey: "states",
    header: "Etats(Régions)",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1 lowercase">
        <span className="capitalize">{row.original.states.join(", ")}</span>
      </div>
    ),
    filterFn: (row, value) => {
      return row.original.states.some((state) => value.includes(state));
    },
  },
  {
    accessorKey: "isBanned",
    header: "Banni",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1 lowercase">
        <span className="capitalize">
          {row.original.isBanned ? (
            <span className="rounded-md bg-red-800 px-2 py-1 text-white">
              Oui
            </span>
          ) : (
            <span className="rounded-md bg-green-800 px-2 py-1 text-white">
              Non
            </span>
          )}
        </span>
      </div>
    ),
  },

  {
    id: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      const handleBanUser = async () => {
        try {
          await banUser(row.original.id as string);
          toast.success("Commercial banni avec succès");
        } catch (error) {
          toast.error(
            "Erreur lors de la bannissement du commercial. Veuillez réessayer.",
          );
        }
      };
      const handleDeleteUser = async () => {
        try {
          await deleteUser(row.original.id);
          toast.success("Commercial supprimé avec succès");
        } catch (error) {
          toast.error(
            "Erreur lors de la suppression du commercial. Veuillez réessayer.",
          );
        }
      };
      const handleUnbanUser = async () => {
        try {
          await unbanUser(row.original.id);
          toast.success("Commercial débanni avec succès");
        } catch (error) {
          toast.error(
            "Erreur lors de la débannissement du commercial. Veuillez réessayer.",
          );
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
                      Êtes-vous sûr de vouloir supprimer ce commercial ?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Cette action est irréversible.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteUser}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      Supprimer
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              {row.original.isBanned ? (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem
                      className="flex cursor-pointer items-center"
                      onSelect={(e) => e.preventDefault()}
                    >
                      <Ban className="mr-2 size-4" />
                      Débannir
                    </DropdownMenuItem>
                  </AlertDialogTrigger>

                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Êtes-vous sûr de vouloir débannir ce commercial ?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Débannir ce commercial permettra à celui-ci de se
                        connecter à la plateforme.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleUnbanUser}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Débannir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem
                      className="flex cursor-pointer items-center"
                      onSelect={(e) => e.preventDefault()}
                    >
                      <Ban className="mr-2 size-4" />
                      Ban
                    </DropdownMenuItem>
                  </AlertDialogTrigger>

                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Êtes-vous sûr de vouloir bannir ce commercial ?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Bannir ce commercial empêchera celui-ci de se connecter
                        à la plateforme.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleBanUser}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Bannir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
