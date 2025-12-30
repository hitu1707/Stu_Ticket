import useSettingsStore from '@/store/settingsStore';
import { sendTicketAlertSMS } from '@/services/smsService';
import { toast } from 'sonner';

/**
 * Send REAL SMS Alert to Admin
 */
export const sendTicketAlert = async (ticket) => {
  const { adminMobile, smsEnabled, smsApiKey, addSMSToHistory } = useSettingsStore.getState();

  // Check if SMS is enabled
  if (!smsEnabled) {
    console.log('SMS notifications are disabled');
    return null;
  }

  // Check if admin mobile is configured
  if (!adminMobile) {
    console.warn('Admin mobile number not configured');
    toast.warning('Please configure admin mobile number in settings');
    return null;
  }

  // Check if API key is configured
  if (!smsApiKey) {
    console.warn('SMS API key not configured');
    toast.warning('Please configure SMS API key in settings');
    return null;
  }

  // Validate mobile number
  if (!/^[0-9]{10}$/.test(adminMobile)) {
    console.error('Invalid admin mobile number');
    toast.error('Invalid admin mobile number in settings');
    return null;
  }

  // Show loading toast
  const loadingToast = toast.loading('Sending SMS alert...');

  try {
    // 📱 SEND REAL SMS
    const result = await sendTicketAlertSMS(adminMobile, ticket);

    if (result.success) {
      // Success!
      toast.dismiss(loadingToast);
      toast.success('SMS Alert Sent!', {
        description: `Message sent to ${adminMobile.slice(0, 3)}****${adminMobile.slice(-3)}`,
      });

      // Add to history
      const smsRecord = {
        id: Date.now().toString(),
        to: adminMobile,
        message: createTicketMessage(ticket),
        timestamp: new Date().toISOString(),
        status: 'sent',
        type: 'ticket_created',
        ticketId: ticket.id,
      };
      addSMSToHistory(smsRecord);

      console.log('✅ Real SMS sent successfully:', result);
      return result;

    } else {
      // Failed
      toast.dismiss(loadingToast);
      toast.error('Failed to send SMS', {
        description: result.error || 'Please check your API key and credits',
      });
      
      console.error('❌ SMS sending failed:', result);
      return null;
    }

  } catch (error) {
    toast.dismiss(loadingToast);
    toast.error('SMS Error', {
      description: error.message,
    });
    
    console.error('❌ SMS error:', error);
    return null;
  }
};

/**
 * Create formatted SMS message
 */
const createTicketMessage = (ticket) => {
  let msg = `🎫 New Ticket Alert\n\n`;
  msg += `ID: #${ticket.id.slice(-6)}\n`;
  msg += `Type: ${getTypeLabel(ticket.ticketType)}\n`;
  msg += `Priority: ${ticket.priority.toUpperCase()}\n`;
  
  if (ticket.studentName) {
    msg += `Student: ${ticket.studentName}\n`;
  }
  
  msg += `\nBy: ${ticket.createdBy}\n`;
  msg += `Time: ${new Date().toLocaleTimeString()}`;
  
  return msg;
};

const getTypeLabel = (value) => {
  const types = {
    'zenox_exam_not_found': 'Exam Not Found',
    'zenox_questions_not_visible': 'Questions Not Visible',
    'technical_issue': 'Technical Issue',
    'other': 'Other',
  };
  return types[value] || value;
};