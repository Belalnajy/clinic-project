import { z } from 'zod';

export const medicationSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
  default_dosage: z.string().max(255, 'Dosage is too long').optional(),
  description: z.string().max(1000, 'Description is too long').optional(),
  is_active: z.boolean().default(true),
});

export const defaultMedicationValues = {
  name: '',
  default_dosage: '',
  description: '',
  is_active: true,
};
