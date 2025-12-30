import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { TICKET_TYPES } from '@/constants/ticketTypes';
import { Calendar, User, Phone, Hash, FileText, Tag } from 'lucide-react';

export default function TicketDetailsDialog({ ticket, open, onClose }) {
  if (!ticket) return null;

  const getTicketTypeLabel = (value) => {
    return TICKET_TYPES.find(t => t.value === value)?.label || value;
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      resolved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      closed: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    };
    return variants[status] || variants.pending;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle className="dark:text-white flex items-center justify-between">
            <span>Ticket Details</span>
            <Badge className={getStatusBadge(ticket.status)}>
              {ticket.status.replace('_', ' ').toUpperCase()}
            </Badge>
          </DialogTitle>
          <DialogDescription className="dark:text-gray-400">
            Ticket ID: <span className="font-mono">#{ticket.id.slice(-8)}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Ticket Type */}
          <div className="flex items-start gap-3">
            <Tag className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5" />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Ticket Type</div>
              <div className="text-base dark:text-white">{getTicketTypeLabel(ticket.ticketType)}</div>
            </div>
          </div>

          <Separator className="dark:bg-gray-700" />

          {/* Student Details */}
          {ticket.studentName && (
            <>
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Student Name</div>
                  <div className="text-base dark:text-white">{ticket.studentName}</div>
                </div>
              </div>
              <Separator className="dark:bg-gray-700" />
            </>
          )}

          {ticket.studentMobile && (
            <>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Student Mobile</div>
                  <div className="text-base dark:text-white">{ticket.studentMobile}</div>
                </div>
              </div>
              <Separator className="dark:bg-gray-700" />
            </>
          )}

          {ticket.studentRegNumber && (
            <>
              <div className="flex items-start gap-3">
                <Hash className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Registration Number</div>
                  <div className="text-base dark:text-white">{ticket.studentRegNumber}</div>
                </div>
              </div>
              <Separator className="dark:bg-gray-700" />
            </>
          )}

          {ticket.subjectName && (
            <>
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Subject</div>
                  <div className="text-base dark:text-white">{ticket.subjectName}</div>
                </div>
              </div>
              <Separator className="dark:bg-gray-700" />
            </>
          )}

          {/* Remarks */}
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5" />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Remarks</div>
              <div className="text-base dark:text-white whitespace-pre-wrap">{ticket.remarks}</div>
            </div>
          </div>

          <Separator className="dark:bg-gray-700" />

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5" />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Created By</div>
                <div className="text-base dark:text-white">{ticket.createdBy || 'Unknown'}</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5" />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Created At</div>
                <div className="text-base dark:text-white">{formatDate(ticket.createdAt)}</div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}