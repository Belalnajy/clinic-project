import { z } from 'zod';

const phoneRegex = /^\+20\d{10}$/;

export const patients = z.object({
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
      expiryDate: z.string().optional(),
    })
    .optional(),
});

export const defaultPatientValues = {
  first_name: '',
  last_name: '',
  birth_date: '',
  gender: '',
  email: '',
  phone_number: '',
  address: '',
  city: '',
  blood_type: '',
  height: '',
  weight: '',
  payment_type: '',
  credit_card_number: '',
  insurance_provider: '',
  insurance_number: '',
  insurance_expiration_date: '',
  is_active: true,
};


