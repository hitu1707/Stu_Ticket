export const TICKET_TYPES = [
  {
    value: 'zenox_exam_not_found',
    label: 'Zenox Exam Not Found',
    requiresDetails: true,
  },
  {
    value: 'zenox_questions_not_visible',
    label: 'Zenox Student Exam – Questions not visible',
    requiresDetails: true,
  },
  {
    value: 'technical_issue',
    label: 'Technical Issue',
    requiresDetails: false,
  },
  {
    value: 'other',
    label: 'Other',
    requiresDetails: false,
  },
];

export const TICKET_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
};

export const TICKET_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
};

export const PRIORITY_CONFIG = {
  low: {
    label: 'Low',
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    badgeColor: 'bg-gray-500',
  },
  medium: {
    label: 'Medium',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    badgeColor: 'bg-blue-500',
  },
  high: {
    label: 'High',
    color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    badgeColor: 'bg-orange-500',
  },
  urgent: {
    label: 'Urgent',
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    badgeColor: 'bg-red-500',
  },
};