// ** ShadCN Components **//
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
// ** React Hook Forms **//
import { z } from 'zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getPrescriptionFormData } from '@/utils/patient';

const prescriptionSchema = z.object({
  medicalRecordId: z.string().min(1, 'Medical record is required'),
  medications: z
    .array(
      z.object({
        medicationId: z.string().min(1, 'Medication is required'),
        dosage: z.string().min(1),
        frequency: z.string().min(1),
        duration: z.string().min(1),
        instructions: z.string().optional(),
      })
    )
    .min(1, 'At least one medication is required'),
});

const Prescription = ({ isOpen, setIsPrescriptionOpen }) => {
  const prescriptionData = getPrescriptionFormData(1);
  const { medicalRecords, medications } = prescriptionData;
  const form = useForm({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      medicalRecordId: '',
      medications: [
        {
          medicationId: '',
          dosage: '',
          frequency: '',
          duration: '',
          instructions: '',
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: 'medications',
    control: form.control,
  });

  const onSubmit = (data) => {
    console.log('Form Data:', data);
    // Here you would typically send the data to your backend
    // For example: await api.post('/prescriptions', data);
    setIsPrescriptionOpen(false);
    form.reset();
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsPrescriptionOpen}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Prescription</DialogTitle>
          <DialogDescription>Create a new Prescription record for "Test Name"</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Medical Record */}
            <FormField
              control={form.control}
              name="medicalRecordId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medical Record</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select medical record" />
                      </SelectTrigger>
                      <SelectContent>
                        {medicalRecords.map((record) => (
                          <SelectItem key={record.id} value={record.id.toString()}>
                            {record.diagnosis}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Medications */}
            {fields.map((field, index) => (
              <div key={field.id} className="border p-4 rounded-md space-y-4">
                <div className="flex justify-between items-center">
                  <FormLabel>Medication {index + 1}</FormLabel>
                  {fields.length > 1 && (
                    <Button variant="destructive" size="sm" onClick={() => remove(index)}>
                      Remove
                    </Button>
                  )}
                </div>

                <FormField
                  control={form.control}
                  name={`medications.${index}.medicationId`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medication</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select medication" />
                          </SelectTrigger>
                          <SelectContent>
                            {medications.map((med) => (
                              <SelectItem key={med.id} value={med.id}>
                                {med.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`medications.${index}.dosage`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dosage</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 20mg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`medications.${index}.frequency`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frequency</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Twice a day" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`medications.${index}.duration`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 7 days" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`medications.${index}.instructions`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instructions</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Optional instructions" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  append({
                    medicationId: '',
                    dosage: '',
                    frequency: '',
                    duration: '',
                    instructions: '',
                  })
                }
              >
                Add Medication
              </Button>
              <Button type="submit">Submit Prescription</Button>
              <Button
                type="button"
                variant="destructive"
                onClick={() => setIsPrescriptionOpen(false)}
              >
                close
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default Prescription;
