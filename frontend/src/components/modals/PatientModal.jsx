import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { toast } from 'sonner';
import axiosInstance from '@/lib/axios';

const phoneRegex = /^\+20\d{10}$/; 

const patientSchema = z.object({
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
  insuranceInfo: z.object({
    provider: z.string().min(1, 'Insurance provider is required').optional(),
    policyNumber: z.string().min(1, 'Policy number is required').optional(),
    expiryDate: z
      .string()
      .refine((val) => new Date(val) >= new Date(), 'Insurance cannot be expired')
      .optional(),
  }),
});

const PatientModal = ({ isOpen, onClose, onSave, user, patientData }) => {
  const [paymentType, setPaymentType] = useState('');
  const form = useForm({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      bloodType: '',
      height: '',
      weight: '',
      paymentType: '',
      creditCardNumber: '',
      insuranceInfo: {
        provider: '',
        policyNumber: '',
        expiryDate: '',
      },
    },
  });

  const { reset } = form;

  useEffect(() => {
    if (patientData) {
      reset({
        firstName: patientData.first_name || '',
        lastName: patientData.last_name || '',
        dateOfBirth: patientData.birth_date || '',
        gender: patientData.gender || '',
        email: patientData.email || '',
        phone: patientData.phone_number || '',
        address: patientData.address || '',
        city: patientData.city || '',
        bloodType: patientData.blood_type || '',
        height: patientData.height || '',
        weight: patientData.weight || '',
        paymentType: patientData.payment_type || '',
        creditCardNumber: patientData.credit_card_number || '',
        insuranceInfo: {
          provider: patientData.insurance_provider || '',
          policyNumber: patientData.insurance_number || '',
          expiryDate: patientData.insurance_expiration_date || '',
        },
      });
      setPaymentType(patientData.payment_type || '');
    }
  }, [patientData, reset]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        first_name: data.firstName,
        last_name: data.lastName,
        birth_date: data.dateOfBirth,
        gender: data.gender,
        email: data.email,
        phone_number: data.phone,
        address: data.address,
        city: data.city,
        blood_type: data.bloodType,
        height: data.height,
        weight: data.weight,
        payment_type: data.paymentType,
        credit_card_number: data.creditCardNumber,
        insurance_provider: data.insuranceInfo?.provider,
        insurance_number: data.insuranceInfo?.policyNumber,
        insurance_expiration_date: data.insuranceInfo?.expiryDate,
        created_by: 1
      };
      console.log('Data sent to API:', payload);
      const response = await axiosInstance.post('/patients/patients/', payload);

      toast.success(`Patient ${data.firstName} ${data.lastName} saved successfully`);
      onSave(response.data);
      form.reset();
      onClose();
    } catch (error) {
      toast.error('Failed to save patient. Please try again.');
      console.error('test');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-lg w-full mx-auto px-6 py-4 bg-white rounded-lg shadow-lg" 
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        aria-describedby="add-patient-description"
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-800">
            {patientData ? 'Edit Patient' : 'Add New Patient'}
          </DialogTitle>
        </DialogHeader>
        <p id="add-patient-description" className="sr-only">
          Fill out the form below to {patientData ? 'edit' : 'add'} a patient.
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      First Name *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="First name"
                        {...field}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Last Name *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Last name"
                        {...field}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Date of Birth *
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        max={format(new Date(), 'yyyy-MM-dd')}
                        {...field}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Gender *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Email address"
                        {...field}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Phone *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+20XXXXXXXXXX"
                        {...field}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Street address"
                        {...field}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">City</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="City"
                        {...field}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="bloodType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Blood Type</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Blood type"
                        {...field}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Height</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Height (e.g., 170 cm)"
                        {...field}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Weight</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Weight (e.g., 70 kg)"
                        {...field}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="paymentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Payment Type *
                  </FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setPaymentType(value);
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                        <SelectValue placeholder="Select payment type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="creditCard">Credit Card</SelectItem>
                      <SelectItem value="insurance">Insurance</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {paymentType === 'creditCard' && (
              <FormField
                control={form.control}
                name="creditCardNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Credit Card Number *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Credit card number"
                        {...field}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {paymentType === 'insurance' && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="insuranceInfo.provider"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Insurance Provider *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Insurance provider"
                          {...field}
                          className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="insuranceInfo.policyNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Policy Number *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Policy number"
                          {...field}
                          className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="insuranceInfo.expiryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Insurance Expiry Date *
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          min={format(new Date(), 'yyyy-MM-dd')}
                          {...field}
                          className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            <DialogFooter className="flex justify-end space-x-4">
              <Button variant="outline" type="button" onClick={onClose} className="px-4 py-2">
                Cancel
              </Button>
              <Button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                {patientData ? 'Save Changes' : 'Add Patient'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PatientModal;
