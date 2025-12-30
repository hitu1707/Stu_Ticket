import * as yup from 'yup';

export const ticketSchema = yup.object({
  ticketType: yup
    .string()
    .required('Please select a ticket type'),
  
  priority: yup
    .string()
    .required('Please select a priority level'),
  
  // Conditional fields (required only for specific ticket types)
  subjectName: yup
    .string()
    .when('ticketType', {
      is: (val) => val === 'zenox_exam_not_found' || val === 'zenox_questions_not_visible',
      then: (schema) => schema.required('Subject name is required'),
      otherwise: (schema) => schema.notRequired(),
    }),
  
  studentName: yup
    .string()
    .when('ticketType', {
      is: (val) => val === 'zenox_exam_not_found' || val === 'zenox_questions_not_visible',
      then: (schema) => schema
        .min(2, 'Student name must be at least 2 characters')
        .required('Student name is required'),
      otherwise: (schema) => schema.notRequired(),
    }),
  
  studentMobile: yup
    .string()
    .when('ticketType', {
      is: (val) => val === 'zenox_exam_not_found' || val === 'zenox_questions_not_visible',
      then: (schema) => schema
        .matches(/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits')
        .required('Student mobile is required'),
      otherwise: (schema) => schema.notRequired(),
    }),
  
  studentRegNumber: yup
    .string()
    .when('ticketType', {
      is: (val) => val === 'zenox_exam_not_found' || val === 'zenox_questions_not_visible',
      then: (schema) => schema.required('Registration number is required'),
      otherwise: (schema) => schema.notRequired(),
    }),
  
  remarks: yup
    .string()
    .min(10, 'Remarks must be at least 10 characters')
    .max(500, 'Remarks must not exceed 500 characters')
    .required('Remarks are required'),
});