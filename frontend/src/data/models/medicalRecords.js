export const medicalRecords = [
  {
    id: 1,
    patientId: 1,
    doctorId: 2,
    appointmentId: 1,
    diagnosis: 'Normal health',
    description:
      'No major health concerns detected during the check-up. Routine monitoring recommended.',
    notes: 'No major concerns',
    createdAt: '2025-01-15T09:30:00Z',
  },
  {
    id: 2,
    patientId: 1,
    doctorId: 3,
    appointmentId: 2,
    diagnosis: 'Elevated blood pressure',
    description:
      'Blood pressure slightly above normal range. Medication prescribed to help control it.',
    notes: 'Prescribed medication for BP',
    createdAt: '2025-02-01T11:45:00Z',
  },
  {
    id: 3,
    patientId: 2,
    doctorId: 1,
    appointmentId: 3,
    diagnosis: 'Flu',
    description:
      'Symptoms include fever, chills, and sore throat. Prescribed antiviral medication for recovery.',
    notes: 'Advised to rest and stay hydrated',
    createdAt: '2025-02-10T13:00:00Z',
  },
];
