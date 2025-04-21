// ** ShadCN Components **//
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import { Input } from '@/components/ui/input';
// ** React Hook Forms **//
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getPatientDiagnoses } from '@/utils/patient';

const labTestSchema = z.object({
  testName: z.string().min(1, 'Test name is required'),
  result: z.string().optional(),
  date: z
    .string()
    .min(1, 'Test date is required')
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid date format',
    }),
  notes: z.string().optional(),
  medicalRecordId: z.string().min(1, 'Medical record ID is required'),
});

const LabTest = ({ isOpen, setIsLabTestOpen }) => {
  const form = useForm({
    resolver: zodResolver(labTestSchema),
    defaultValues: {
      testName: '',
      result: '',
      date: '',
      notes: '',
    },
  });
  const onSubmit = (data) => {
    // Handle form submission
    console.log('Form submitted:', data);
    setIsLabTestOpen(false);
    form.reset();
  };

  const medicalRecords = getPatientDiagnoses(1);

  return (
    <Dialog open={isOpen} onOpenChange={setIsLabTestOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Lab Test Result</DialogTitle>
          <DialogDescription>Add Lab Test Result for "Test Name"</DialogDescription>
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
                          <SelectItem key={record.id} value={record.diagnosis}>
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

            {/* Test Name */}
            <FormField
              control={form.control}
              name="testName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Test Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter test name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Test Result */}
            <FormField
              control={form.control}
              name="result"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Test Result</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter test result" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Test Date */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Test Date</FormLabel>
                  <FormControl>
                    <Input type="date" placeholder="Enter test date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Optional notes" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <Button type="submit">Submit Lab Test</Button>
              <Button type="button" variant="destructive" onClick={() => setIsLabTestOpen(false)}>
                Close
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default LabTest;
