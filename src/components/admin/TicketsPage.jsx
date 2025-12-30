import { useState } from 'react';
import { ArrowLeft, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../layout/ThemeToggle';
import TicketTable from './TicketTable';
import TicketDetailsDialog from './TicketDetailsDialog';
import EditTicketDialog from './EditTicketDialog';
import useTicketStore from '@/store/ticketStore';

export default function TicketsPage() {
  const navigate = useNavigate();
  const tickets = useTicketStore((state) => state.tickets);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket);
    setViewDialogOpen(true);
  };

  const handleEditTicket = (ticket) => {
    setSelectedTicket(ticket);
    setEditDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/dashboard')}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-3">
                <div className="bg-indigo-600 p-2 rounded-lg">
                  <Ticket className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  All Tickets
                </h1>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">Ticket Management</CardTitle>
            <CardDescription className="dark:text-gray-400">
              View, edit, and manage all support tickets
            </CardDescription>
          </CardHeader>
          <CardContent>
            {tickets.length === 0 ? (
              <div className="text-center py-12">
                <Ticket className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
                  No tickets
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Get started by creating a new ticket.
                </p>
                <div className="mt-6">
                  <Button onClick={() => navigate('/tickets/new')}>
                    Create Ticket
                  </Button>
                </div>
              </div>
            ) : (
              <TicketTable onViewTicket={handleViewTicket} onEditTicket={handleEditTicket} />
            )}
          </CardContent>
        </Card>
      </main>

      {/* Dialogs */}
      <TicketDetailsDialog
        ticket={selectedTicket}
        open={viewDialogOpen}
        onClose={() => {
          setViewDialogOpen(false);
          setSelectedTicket(null);
        }}
      />

      <EditTicketDialog
        ticket={selectedTicket}
        open={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);
          setSelectedTicket(null);
        }}
      />
    </div>
  );
}