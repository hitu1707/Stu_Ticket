import { useState, useMemo } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { MoreHorizontal, ArrowUpDown, Eye, Edit, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';
import useTicketStore from '@/store/ticketStore';
import { TICKET_TYPES } from '@/constants/ticketTypes';

export default function TicketTable({ onViewTicket, onEditTicket }) {
  const tickets = useTicketStore((state) => state.tickets);
  const deleteTicket = useTicketStore((state) => state.deleteTicket);
  
  const [sorting, setSorting] = useState([]);
  const [filtering, setFiltering] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState(null);

  // Get ticket type label
  const getTicketTypeLabel = (value) => {
    return TICKET_TYPES.find(t => t.value === value)?.label || value;
  };

  // Status badge color
  const getStatusBadge = (status) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      resolved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      closed: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    };
    return variants[status] || variants.pending;
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Table columns
  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
              className="dark:text-gray-200"
            >
              Ticket ID
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => (
          <div className="font-mono text-sm dark:text-gray-300">
            #{row.getValue('id').slice(-6)}
          </div>
        ),
      },
      {
        accessorKey: 'ticketType',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
              className="dark:text-gray-200"
            >
              Type
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => (
          <div className="max-w-[200px] truncate dark:text-gray-300">
            {getTicketTypeLabel(row.getValue('ticketType'))}
          </div>
        ),
      },
      {
        accessorKey: 'studentName',
        header: 'Student',
        cell: ({ row }) => (
          <div className="dark:text-gray-300">
            {row.getValue('studentName') || '-'}
          </div>
        ),
      },
      {
        accessorKey: 'status',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
              className="dark:text-gray-200"
            >
              Status
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => {
          const status = row.getValue('status');
          return (
            <Badge className={getStatusBadge(status)}>
              {status.replace('_', ' ').toUpperCase()}
            </Badge>
          );
        },
      },
      {
        accessorKey: 'createdAt',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
              className="dark:text-gray-200"
            >
              Created
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => (
          <div className="text-sm dark:text-gray-300">
            {formatDate(row.getValue('createdAt'))}
          </div>
        ),
      },
      {
        id: 'actions',
        cell: ({ row }) => {
          const ticket = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onViewTicket(ticket)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEditTicket(ticket)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600 dark:text-red-400"
                  onClick={() => {
                    setTicketToDelete(ticket);
                    setDeleteDialogOpen(true);
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [onViewTicket, onEditTicket]
  );

  // Table instance
  const table = useReactTable({
    data: tickets,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltering,
    state: {
      sorting,
      globalFilter: filtering,
    },
  });

  // Handle delete
  const handleDelete = () => {
    if (ticketToDelete) {
      deleteTicket(ticketToDelete.id);
      toast.success('Ticket deleted successfully');
      setDeleteDialogOpen(false);
      setTicketToDelete(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search tickets..."
            value={filtering}
            onChange={(e) => setFiltering(e.target.value)}
            className="pl-10 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {table.getFilteredRowModel().rows.length} ticket(s)
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border dark:border-gray-700 overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="dark:border-gray-700">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="dark:text-gray-200">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="dark:border-gray-700 dark:hover:bg-gray-800"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center dark:text-gray-400">
                  No tickets found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="dark:bg-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="dark:text-white">
              Are you sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="dark:text-gray-400">
              This action cannot be undone. This will permanently delete the ticket
              <span className="font-mono font-bold">
                {' '}#{ticketToDelete?.id.slice(-6)}
              </span>
              .
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}