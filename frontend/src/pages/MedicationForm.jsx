import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { medicationSchema, defaultMedicationValues } from '@/schemas/medication';
import { getMedicationById, createMedication, updateMedication } from '@/services/medications';
import { toast } from 'sonner';

const MedicationForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const form = useForm({
    resolver: zodResolver(medicationSchema),
    defaultValues: defaultMedicationValues,
  });

  useEffect(() => {
    const fetchMedication = async () => {
      if (!isEditing) return;

      try {
        const medication = await getMedicationById(id);
        form.reset(medication);
      } catch (error) {
        console.error('Error fetching medication:', error);
        toast.error({
          title: 'Error',
          description: 'Failed to load medication data.',
        });
        navigate('/medications');
      }
    };

    fetchMedication();
  }, [id, isEditing, form, navigate]);

  const onSubmit = async (values) => {
    try {
      if (isEditing) {
        await updateMedication(id, values);
        toast.success('Success', {
          description: 'Medication updated successfully.',
        });
      } else {
        await createMedication(values);
        toast.success('Success', {
          description: 'Medication created successfully.',
        });
      }
      navigate('/medications');
    } catch (error) {
      console.error('Error saving medication:', error);
      toast.error('Error', {
        description: 'Failed to save medication.',
      });
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate('/medications')} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Medications
        </Button>
        <h1 className="text-2xl font-bold">
          {isEditing ? 'Edit Medication' : 'Add New Medication'}
        </h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter medication name" {...field} />
                </FormControl>
                <FormDescription>The name of the medication.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="default_dosage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Default Dosage</FormLabel>
                <FormControl>
                  <Input placeholder="Enter default dosage" {...field} />
                </FormControl>
                <FormDescription>
                  The default dosage for this medication (e.g., 500mg).
                </FormDescription>
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
                  <Textarea
                    placeholder="Enter medication description"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Additional information about the medication.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="is_active"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Active</FormLabel>
                  <FormDescription>
                    Whether this medication is currently available for use.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => navigate('/medications')}>
              Cancel
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Update' : 'Create'} Medication
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default MedicationForm;
