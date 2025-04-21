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
// ** React Hook Forms **//
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = z.object({
  diagnosis: z.string().min(1, { message: 'Diagnosis is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
  notes: z.string().optional(),
});

const MedicalRecord = ({ isOpen, setIsMedicalRecordOpen }) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      diagnosis: '',
      description: '',
      notes: '',
    },
  });

  //! For Testing...
  const onSubmit = (data) => {
    // Handle form submission
    console.log('Form submitted:', data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsMedicalRecordOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Medical Record</DialogTitle>
          <DialogDescription>Create a new medical record for "Test Name"</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="diagnosis"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Diagnosis</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter diagnosis" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter notes" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsMedicalRecordOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Record</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MedicalRecord;
