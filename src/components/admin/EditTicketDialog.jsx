import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TICKET_STATUS } from '@/constants/ticketTypes';
import useTicketStore from '@/store/ticketStore';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function EditTicketDialog({ ticket, open, onClose }) {
  const updateTicket = useTicketStore((state) => state.updateTicket);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const status = watch('status');

  useEffect(() => {
    if (ticket) {
      reset({
        status: ticket.status,
        remarks: ticket.remarks,
        studentName: ticket.studentName || '',
        studentMobile: ticket.studentMobile || '',
      });
    }
  }, [ticket, reset]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      updateTicket(ticket.id, {
        status: data.status,
        remarks: data.remarks,
        studentName: data.studentName,
        studentMobile: data.studentMobile,
      });

      toast.success('Ticket updated successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to update ticket');
    } finally {
      setIsLoading(false);
    }
  };

  if (!ticket) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle className="dark:text-white">Edit Ticket</DialogTitle>
          <DialogDescription className="dark:text-gray-400">
            Update ticket details and status
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status" className="dark:text-gray-200">Status</Label>
            <Select
              value={status}
              onValueChange={(value) => setValue('status', value)}
            >
              <SelectTrigger className="dark:bg-gray-700 dark:text-white dark:border-gray-600">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(TICKET_STATUS).map(([key, value]) => (
                  <SelectItem key={value} value={value}>
                    {key.replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Student Name */}
          {ticket.studentName && (
            <div className="space-y-2">
              <Label htmlFor="studentName" className="dark:text-gray-200">Student Name</Label>
              <Input
                id="studentName"
                {...register('studentName')}
                className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>
          )}

          {/* Student Mobile */}
          {ticket.studentMobile && (
            <div className="space-y-2">
              <Label htmlFor="studentMobile" className="dark:text-gray-200">Student Mobile</Label>
              <Input
                id="studentMobile"
                type="tel"
                {...register('studentMobile')}
                className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>
          )}

          {/* Remarks */}
          <div className="space-y-2">
            <Label htmlFor="remarks" className="dark:text-gray-200">Remarks</Label>
            <Textarea
              id="remarks"
              rows={5}
              {...register('remarks', { required: 'Remarks are required' })}
              className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
            {errors.remarks && (
              <p className="text-sm text-red-500">{errors.remarks.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}