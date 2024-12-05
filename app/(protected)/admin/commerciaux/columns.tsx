import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { format, isWithinInterval } from 'date-fns';
import { ArrowUpDown, Ban, LogIn, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Currency } from '@prisma/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
} from '@/components/ui/alert-dialog';
import { Trash } from 'lucide-react';
import { toast } from 'react-toastify';
import { UserWithRelations } from './page';
import { banUser, deleteUser, unbanUser } from './users';
import { regionNames } from '@/utils/funcs';
import { signInAsUser } from './signin-as-user.server';
import { DocumentCheckIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export const columns: ColumnDef<UserWithRelations>[] = [
  {
    id: 'Selection',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: 'user',
    header: 'User',
    cell: ({ row }) => (
      <div className='lowercase flex flex-col gap-1'>
        <span className='font-bold'>
          {row.original.firstName} {row.original.lastName}
        </span>
        <span className='text-xs text-gray-500'>{row.original.id}</span>
      </div>
    ),
    filterFn: (row, id, value) => {
      return (
        row.original.firstName.includes(value) ||
        row.original.lastName.includes(value) ||
        row.original.id.includes(value)
      );
    },
  },
  {
    accessorKey: 'country',
    header: 'Country',
    cell: ({ row }) => (
      <div className='lowercase flex flex-col gap-1'>
        <span className='font-bold capitalize'>
          {row.original.address?.country
            ? regionNames.of(row.original.address?.country)
            : ''}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => (
      <div className='text-sm font-medium'>
        {row.original.accountType === 'ADMIN' ? (
          <span className='inline-flex items-center truncate rounded-full bg-red-100 px-1.5 py-0.5 text-red-800 sm:px-2 sm:py-1'>
            Admin
          </span>
        ) : (
          <span className='inline-flex items-center truncate rounded-full bg-green-100 px-1.5 py-0.5 text-green-800 sm:px-2 sm:py-1'>
            Freelancer
          </span>
        )}
      </div>
    ),
    filterFn: (row, id, value) => {
      if (value === '' || value === undefined || value === 'All') return true;
      return row.original.accountType === value;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <div className='text-sm font-medium'>
        {row.original.isBanned || row.original.isDeleted ? (
          <span className='inline-flex items-center truncate rounded-full bg-red-100 px-1.5 py-0.5 text-red-800 sm:px-2 sm:py-1'>
            {row.original.isBanned ? 'Banned' : 'Deleted'}
          </span>
        ) : (
          <span className='inline-flex items-center truncate rounded-full bg-green-100 px-1.5 py-0.5 text-green-800 sm:px-2 sm:py-1'>
            Active
          </span>
        )}
      </div>
    ),
  },

  {
    accessorKey: 'invoices',
    header: 'Invoices',
    cell: ({ row }) => (
      <div className='text-sm font-medium'>{row.original.invoices.length}</div>
    ),
  },
  {
    accessorKey: 'signedAgreement',
    header: 'Signed Agreement',
    cell: ({ row }) => (
      <div className='text-sm font-medium'>
        {row.original.agreementSignature?.length > 0 ? (
          <span className='inline-flex items-center truncate rounded-full bg-green-100 px-1.5 py-0.5 text-green-800 sm:px-2 sm:py-1'>
            Yes
          </span>
        ) : (
          <span className='inline-flex items-center truncate rounded-full bg-red-100 px-1.5 py-0.5 text-red-800 sm:px-2 sm:py-1'>
            No
          </span>
        )}
      </div>
    ),
    filterFn: (row, id, value) => {
      if (value === '' || value === undefined || value === 'All') return true;
      if (value === 'Yes') return row.original.agreementSignature?.length > 0;
      if (value === 'No') return row.original.agreementSignature?.length === 0;
      return false;
    },
  },
  {
    accessorKey: 'date',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Date
          <ArrowUpDown className='ml-2 size-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      const formattedDate = format(row.original.createdAt, 'dd/MM/yyyy');
      return <div className='lowercase'>{formattedDate}</div>;
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
        console.error('Date filtering error:', error);
        return false;
      }
    },
  },

  {
    id: 'Actions',
    enableHiding: false,
    cell: ({ row }) => {
      const handleBanUser = async () => {
        try {
          await banUser(row.original.id as string);
          toast.success('User banned successfully');
        } catch (error) {
          toast.error('Error deleting transaction. Please try again.');
        }
      };
      const handleDeleteUser = async () => {
        try {
          await deleteUser(row.original.id);
          toast.success('User deleted successfully');
        } catch (error) {
          toast.error('Error deleting user. Please try again.');
        }
      };
      const handleUnbanUser = async () => {
        try {
          await unbanUser(row.original.id);
          toast.success('User unbanned successfully');
        } catch (error) {
          toast.error('Error unbanning user. Please try again.');
        }
      };

      const handleSignInAsUser = async () => {
        try {
          await signInAsUser(row.original.id);
          toast.success('Signed in as user successfully');
          window.location.href = '/freelancer/dashboard';
        } catch (error) {
          toast.error('Error signing in as user. Please try again.');
        }
      };

      return (
        <div className='flex items-center'>
          <DropdownMenu>
            <DropdownMenuTrigger className='cursor-pointer'>
              <MoreHorizontal className='' />
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              {row.original.agreementSignature?.length > 0 && (
                <DropdownMenuItem
                  className='flex cursor-pointer items-center'
                  onSelect={(e) => e.preventDefault()}
                >
                  <Link
                    href={`/admin/signatures/${row.original.agreementSignature[0].id}`}
                    className='flex items-center'
                    target='_blank'
                  >
                    <DocumentCheckIcon className='mr-2 size-4' />
                    View signed agreement
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                className='flex cursor-pointer items-center'
                onSelect={(e) => e.preventDefault()}
                onClick={handleSignInAsUser}
              >
                <LogIn className='mr-2 size-4' />
                Sign in as user
              </DropdownMenuItem>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    className='flex cursor-pointer items-center'
                    onSelect={(e) => e.preventDefault()}
                  >
                    <Trash className='mr-2 size-4' />
                    Delete
                  </DropdownMenuItem>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you sure you want to delete this user ?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteUser}
                      className='bg-red-500 hover:bg-red-600'
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              {row.original.isBanned ? (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem
                      className='flex cursor-pointer items-center'
                      onSelect={(e) => e.preventDefault()}
                    >
                      <Ban className='mr-2 size-4' />
                      Unban
                    </DropdownMenuItem>
                  </AlertDialogTrigger>

                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you sure you want to unban this user ?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Unbanning this user will allow them to log in to the
                        platform.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleUnbanUser}
                        className='bg-red-500 hover:bg-red-600'
                      >
                        Unban
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem
                      className='flex cursor-pointer items-center'
                      onSelect={(e) => e.preventDefault()}
                    >
                      <Ban className='mr-2 size-4' />
                      Ban
                    </DropdownMenuItem>
                  </AlertDialogTrigger>

                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you sure you want to ban this user ?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Banning this user will prevent them from logging in to
                        the platform.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleBanUser}
                        className='bg-red-500 hover:bg-red-600'
                      >
                        Ban
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

function formatAmount(amount: number, currency: Currency) {
  return `${currency} ${amount.toFixed(2)}`;
}
