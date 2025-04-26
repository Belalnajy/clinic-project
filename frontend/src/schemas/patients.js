import { z } from 'zod';

const phoneRegex = /^\+20\d{10}$/;

const patients = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z
    .string()
    .refine((val) => new Date(val) <= new Date(), 'Date of birth cannot be in the future'),
  gender: z.string().min(1, 'Gender is required'),
  email: z.string().email('Invalid email format').optional(),
  phone: z.string().regex(phoneRegex, 'Phone format must be +20XXXXXXXXXX'),
  address: z.string().optional(),
  city: z.string().optional(),
  bloodType: z.string().optional(),
  height: z.string().optional(),
  weight: z.string().optional(),
  paymentType: z.string().min(1, 'Payment type is required'),
  creditCardNumber: z.string().optional(),
  insuranceInfo: z
    .object({
      provider: z.string().optional(),
      policyNumber: z.string().optional(),
      expiryDate: z
        .string()
        .refine((val) => !val || new Date(val) >= new Date(), 'Insurance cannot be expired')
        .optional(),
    })
    .optional(),
});

export default patients;
