import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { specializationsApi } from '@/api/specializations';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  name: z.string()
    .min(2, 'Specialization name must be at least 2 characters')
    .nonempty('Specialization name is required'),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .nonempty('Description is required'),
});

function SpecializationsPage() {
  const [specializations, setSpecializations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch specializations on component mount
  useEffect(() => {
    fetchSpecializations();
  }, []);

  const fetchSpecializations = async () => {
    try {
      const data = await specializationsApi.getAll();
      setSpecializations(data);
      setError(null);
    } catch (err) {
      setError('Failed to load specializations');
      toast.error('Error', {
        description: 'Failed to load specializations. Please try again later.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      const newSpecialization = await specializationsApi.create(data);
      setSpecializations([...specializations, newSpecialization]);
      form.reset();
      toast.success('Success', {
        description: 'Specialization added successfully'
      });
    } catch (err) {
      toast.error('Error', {
        description: err.response?.data?.message || 'Failed to add specialization'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await specializationsApi.delete(id);
      setSpecializations(specializations.filter(spec => spec.id !== id));
      toast.success('Success', {
        description: 'Specialization deleted successfully'
      });
    } catch (err) {
      toast.error('Error', {
        description: err.response?.data?.message || 'Failed to delete specialization'
      });
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">Something went wrong</h3>
          <p className="mt-1 text-gray-500">{error}</p>
          <Button onClick={fetchSpecializations} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Specialization</CardTitle>
          <CardDescription>Create a new medical specialization in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specialization Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Cardiology" {...field} />
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
                      <Input placeholder="Brief description of the specialization" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Specialization"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Specializations</CardTitle>
          <CardDescription>Manage all medical specializations</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {specializations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                      No specializations found
                    </TableCell>
                  </TableRow>
                ) : (
                  specializations.map((spec) => (
                    <TableRow key={spec.id}>
                      <TableCell className="font-medium">{spec.name}</TableCell>
                      <TableCell>{spec.description}</TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(spec.id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default SpecializationsPage; 