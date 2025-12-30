import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import useAuthStore from '@/store/authStore';
import useTicketStore from '@/store/ticketStore';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../layout/ThemeToggle';
import { LogOut, User, Ticket, Plus, Clock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function Dashboard() {
  const { user, logout } = useAuthStore();
  const tickets = useTicketStore((state) => state.tickets);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  // Calculate stats
  const totalTickets = tickets.length;
  const pendingTickets = tickets.filter(t => t.status === 'pending').length;
  const resolvedTickets = tickets.filter(t => t.status === 'resolved').length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Ticket className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Dashboard
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => navigate('/tickets/new')}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Ticket
            </Button>
            <Button variant="outline" onClick={() => navigate('/profile')}>
              <User className="w-4 h-4 mr-2" />
              Profile
            </Button>
            <ThemeToggle />
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Card */}
        <Card className="mb-6 dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center dark:text-white">
              <User className="w-5 h-5 mr-2" />
              Welcome back, {user?.username || 'User'}!
            </CardTitle>
          </CardHeader>
          <CardContent className="dark:text-gray-300">
            <p>Mobile: {user?.mobile}</p>
            <p>Role: {user?.role}</p>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="dark:bg-gray-800 border-l-4 border-l-indigo-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium dark:text-gray-300">
                Total Tickets
              </CardTitle>
              <Ticket className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                {totalTickets}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                All time tickets
              </p>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 border-l-4 border-l-yellow-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium dark:text-gray-300">
                Pending
              </CardTitle>
              <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                {pendingTickets}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Awaiting response
              </p>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium dark:text-gray-300">
                Resolved
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {resolvedTickets}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Successfully closed
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="dark:text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="h-20 justify-start"
              onClick={() => navigate('/tickets/new')}
            >
              <Plus className="mr-3 h-5 w-5" />
              <div className="text-left">
                <div className="font-semibold">Create New Ticket</div>
                <div className="text-xs text-gray-500">Raise a support request</div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-20 justify-start"
              onClick={() => navigate('/tickets')}
            >
              <Ticket className="mr-3 h-5 w-5" />
              <div className="text-left">
                <div className="font-semibold">View All Tickets</div>
                <div className="text-xs text-gray-500">Manage your tickets</div>
              </div>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}