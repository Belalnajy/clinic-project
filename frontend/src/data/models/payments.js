const payments = [
  {
    appointmentId: 1, // Foreign Key to Appointments table
    patientId: 1, // Foreign Key to Patients table
    amount: 150.0, // Amount paid
    paymentMethod: 'Credit Card', // Payment method
    paymentStatus: 'Paid', // Payment status
    paymentDate: '2025-04-15T10:30:00Z', // Date and time when the payment was made
    createdAt: '2025-04-15T10:30:00Z', // Record creation date
    updatedAt: '2025-04-15T10:30:00Z', // Record last updated date
  },
  {
    appointmentId: 2,
    patientId: 2,
    amount: 75.0,
    paymentMethod: 'Cash',
    paymentStatus: 'Paid',
    paymentDate: '2025-04-16T14:00:00Z',
    createdAt: '2025-04-16T14:00:00Z',
    updatedAt: '2025-04-16T14:00:00Z',
  },
  {
    appointmentId: 3,
    patientId: 3,
    amount: 200.0,
    paymentMethod: 'Insurance',
    paymentStatus: 'Paid',
    paymentDate: '2025-04-17T09:00:00Z',
    createdAt: '2025-04-17T09:00:00Z',
    updatedAt: '2025-04-17T09:00:00Z',
  },
  {
    appointmentId: 4,
    patientId: 1,
    amount: 100.0,
    paymentMethod: 'Credit Card',
    paymentStatus: 'Paid',
    paymentDate: '2025-04-18T16:30:00Z',
    createdAt: '2025-04-18T16:30:00Z',
    updatedAt: '2025-04-18T16:30:00Z',
  },
];
