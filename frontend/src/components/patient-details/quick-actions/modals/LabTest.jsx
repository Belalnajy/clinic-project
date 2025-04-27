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
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
// ** React Hook Forms **//
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAddLabResult } from '@/hooks/useLabResults';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

const labTestSchema = z.object({
  test_name: z.string().min(1, 'Test name is required'),
  results: z.string().min(1, 'Test result is required'),
  test_date: z
    .string()
    .min(1, 'Test date is required')
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid date format',
    }),
  notes: z.string().optional(),
});

const LabTest = ({ isOpen, setIsLabTestOpen }) => {
  const { id: patientId } = useParams();
  const { mutate: addLabResult, isPending } = useAddLabResult();

  const form = useForm({
    resolver: zodResolver(labTestSchema),
    defaultValues: {
      test_name: '',
      results: '',
      test_date: '',
      notes: '',
    },
  });

  const onSubmit = (data) => {
    const requestData = {
      ...data,
      patient_id: Number(patientId),
    };

    addLabResult(requestData, {
      onSuccess: () => {
        toast.success('Lab test result added successfully');
        setIsLabTestOpen(false);
        form.reset();
      },
      onError: (error) => {
        console.error('Lab test error:', error);
        const errorMessage =
          error.response?.data?.detail ||
          error.response?.data?.message ||
          (typeof error.response?.data === 'object'
            ? error.response?.data['test_date']
            : 'Failed to add lab test result');
        toast.error(errorMessage);
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsLabTestOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Lab Test Result</DialogTitle>
          <DialogDescription>Add a new lab test result for the patient</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Test Name */}
            <FormField
              control={form.control}
              name="test_name"
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
              name="results"
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
              name="test_date"
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
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Adding...' : 'Add Lab Test'}
              </Button>
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
