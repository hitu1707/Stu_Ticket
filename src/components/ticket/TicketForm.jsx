import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { ticketSchema } from '@/schemas/ticketSchemas';
import { TICKET_TYPES, TICKET_PRIORITY, PRIORITY_CONFIG } from '@/constants/ticketTypes';
import useTicketStore from '@/store/ticketStore';
import useAuthStore from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function TicketForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const navigate = useNavigate();
  const addTicket = useTicketStore((state) => state.addTicket);
  const user = useAuthStore((state) => state.user);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: yupResolver(ticketSchema),
    defaultValues: {
      ticketType: '',
      priority: 'medium',
      subjectName: '',
      studentName: '',
      studentMobile: '',
      studentRegNumber: '',
      remarks: '',
    },
  });

  const ticketType = watch('ticketType');
  const priority = watch('priority');

  const handleTicketTypeChange = (value) => {
    setSelectedType(value);
    setValue('ticketType', value);
  };

  const handlePriorityChange = (value) => {
    setValue('priority', value);
  };

  const requiresDetails = TICKET_TYPES.find(
    (type) => type.value === ticketType
  )?.requiresDetails;

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Add ticket to store
      const newTicket = addTicket({
        ...data,
        createdBy: user?.username || 'Unknown',
        userMobile: user?.mobile || '',
      });

      // Show success message
      toast.success('Ticket created successfully!', {
        description: `Ticket ID: ${newTicket.id}`,
      });

      // Reset form
      reset();
      setSelectedType('');

      // Navigate to dashboard after 1 second
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);

    } catch (error) {
      console.error('Error creating ticket:', error);
      toast.error('Failed to create ticket. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="dark:text-white">Raise a New Ticket</CardTitle>
        <CardDescription className="dark:text-gray-400">
          Fill out the form below to submit your support ticket
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Ticket Type */}
          <div className="space-y-2">
            <Label htmlFor="ticketType" className="dark:text-gray-200">
              Ticket Type <span className="text-red-500">*</span>
            </Label>
            <Select onValueChange={handleTicketTypeChange} value={ticketType}>
              <SelectTrigger 
                className={`${errors.ticketType ? 'border-red-500' : ''} dark:bg-gray-700 dark:text-white dark:border-gray-600`}
              >
                <SelectValue placeholder="Select ticket type" />
              </SelectTrigger>
              <SelectContent>
                {TICKET_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.ticketType && (
              <p className="text-sm text-red-500">{errors.ticketType.message}</p>
            )}
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label htmlFor="priority" className="dark:text-gray-200">
              Priority Level <span className="text-red-500">*</span>
            </Label>
            <Select onValueChange={handlePriorityChange} value={priority}>
              <SelectTrigger 
                className={`${errors.priority ? 'border-red-500' : ''} dark:bg-gray-700 dark:text-white dark:border-gray-600`}
              >
                <SelectValue placeholder="Select priority level" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(TICKET_PRIORITY).map(([key, value]) => (
                  <SelectItem key={value} value={value}>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${PRIORITY_CONFIG[value].badgeColor}`} />
                      <span>{PRIORITY_CONFIG[value].label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.priority && (
              <p className="text-sm text-red-500">{errors.priority.message}</p>
            )}
          </div>

          {/* Conditional Fields - Only show for specific ticket types */}
          {requiresDetails && (
            <Alert className="dark:bg-gray-700 dark:border-gray-600">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="dark:text-gray-300">
                Please provide the following details for this ticket type
              </AlertDescription>
            </Alert>
          )}

          {requiresDetails && (
            <>
              {/* Subject Name */}
              <div className="space-y-2">
                <Label htmlFor="subjectName" className="dark:text-gray-200">
                  Subject Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="subjectName"
                  type="text"
                  placeholder="e.g., Mathematics, Physics"
                  {...register('subjectName')}
                  className={errors.subjectName ? 'border-red-500' : 'dark:bg-gray-700 dark:text-white dark:border-gray-600'}
                />
                {errors.subjectName && (
                  <p className="text-sm text-red-500">{errors.subjectName.message}</p>
                )}
              </div>

              {/* Student Name */}
              <div className="space-y-2">
                <Label htmlFor="studentName" className="dark:text-gray-200">
                  Student Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="studentName"
                  type="text"
                  placeholder="Enter student's full name"
                  {...register('studentName')}
                  className={errors.studentName ? 'border-red-500' : 'dark:bg-gray-700 dark:text-white dark:border-gray-600'}
                />
                {errors.studentName && (
                  <p className="text-sm text-red-500">{errors.studentName.message}</p>
                )}
              </div>

              {/* Student Mobile */}
              <div className="space-y-2">
                <Label htmlFor="studentMobile" className="dark:text-gray-200">
                  Student Mobile Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="studentMobile"
                  type="tel"
                  placeholder="Enter 10-digit mobile number"
                  {...register('studentMobile')}
                  className={errors.studentMobile ? 'border-red-500' : 'dark:bg-gray-700 dark:text-white dark:border-gray-600'}
                />
                {errors.studentMobile && (
                  <p className="text-sm text-red-500">{errors.studentMobile.message}</p>
                )}
              </div>

              {/* Student Registration Number */}
              <div className="space-y-2">
                <Label htmlFor="studentRegNumber" className="dark:text-gray-200">
                  Student Registration Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="studentRegNumber"
                  type="text"
                  placeholder="Enter registration number"
                  {...register('studentRegNumber')}
                  className={errors.studentRegNumber ? 'border-red-500' : 'dark:bg-gray-700 dark:text-white dark:border-gray-600'}
                />
                {errors.studentRegNumber && (
                  <p className="text-sm text-red-500">{errors.studentRegNumber.message}</p>
                )}
              </div>
            </>
          )}

          {/* Remarks - Always visible */}
          <div className="space-y-2">
            <Label htmlFor="remarks" className="dark:text-gray-200">
              Remarks <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="remarks"
              placeholder="Describe your issue in detail (minimum 10 characters)"
              rows={5}
              {...register('remarks')}
              className={errors.remarks ? 'border-red-500' : 'dark:bg-gray-700 dark:text-white dark:border-gray-600'}
            />
            {errors.remarks && (
              <p className="text-sm text-red-500">{errors.remarks.message}</p>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Minimum 10 characters, maximum 500 characters
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Submit Ticket
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/dashboard')}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}