import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { debounce } from 'lodash';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/Auth/useAuth';
import axiosInstance from '@/lib/axios';
import { getUserProfile } from '@/api/settings';

const formSchema = z.object({
  license_number: z.string().min(5, 'License number must be at least 5 characters').optional().or(z.literal('')),
  years_of_experience: z.coerce.number().min(0, 'Years of experience must be 0 or greater').max(60, 'Years of experience must be less than 60').optional().or(z.literal('')),
  qualifications: z.string().min(5, 'Qualifications must be at least 5 characters').optional().or(z.literal('')),
  bio: z.string().min(10, 'Bio must be at least 10 characters').optional().or(z.literal('')),
  specialization_id: z.string().optional(),
});

function ProfessionalSettings() {
  const { user, updateUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [specializations, setSpecializations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      license_number: '',
      years_of_experience: '',
      qualifications: '',
      bio: '',
      specialization_id: '',
    },
  });

  useEffect(() => {
    // Debounced fetch to avoid redundant requests
    const fetchSpecializations = debounce(async () => {
      try {
        const response = await axiosInstance.get('/doctors/specializations/');
        setSpecializations(response.data);
      } catch (error) {
        console.error('Failed to fetch specializations:', error);
        toast.error('Failed to fetch specializations');
      } finally {
        setIsLoading(false);
      }
    }, 300);

    fetchSpecializations();
    return () => fetchSpecializations.cancel();
  }, []);

  // Ensure form reset depends on user
  useEffect(() => {
    if (user?.doctor_profile) {
      form.reset({
        license_number: user.doctor_profile.license_number || '',
        years_of_experience: user.doctor_profile.years_of_experience || '',
        qualifications: user.doctor_profile.qualifications || '',
        bio: user.doctor_profile.bio || '',
        specialization_id: user.doctor_profile.specialization?.id?.toString() || '',
      });
      console.log('Form reset with user:', user);
      console.log('Form values after reset:', form.getValues());
    }
  }, [user, form]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const doctorId = user?.id;
      if (!doctorId) {
        throw new Error('Doctor profile not found');
      }
      // Prepare all required doctor fields for PUT
      const doctorData = {
        license_number: user.doctor_profile?.license_number || '',
        years_of_experience: data.years_of_experience ? Number(data.years_of_experience) : 0,
        qualifications: data.qualifications?.trim() || '',
        bio: data.bio?.trim() || '',
        specialization: data.specialization_id || null,
        is_active: user.is_active !== undefined ? user.is_active : true,
      };
      // Use PATCH instead of PUT to avoid unique constraint issues
      await axiosInstance.patch(`/doctors/doctorsList/${doctorId}/`, doctorData);
      const updatedUser = await getUserProfile();
      if (updateUser) updateUser(updatedUser);
      form.reset({
        years_of_experience: updatedUser.doctor_profile?.years_of_experience || '',
        qualifications: updatedUser.doctor_profile?.qualifications || '',
        bio: updatedUser.doctor_profile?.bio || '',
        specialization_id: updatedUser.doctor_profile?.specialization?.id?.toString() || '',
      });
      toast.success('Professional information updated successfully');
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 
                         Object.entries(error.response?.data || {})
                           .map(([key, value]) => `${key}: ${value}`)
                           .join('\n') ||
                         error.message ||
                         'Please try again';
      toast.error('Failed to update professional information', {
        description: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (user?.role !== 'doctor') {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Professional Information</CardTitle>
        <CardDescription>
          Update your professional details and qualifications
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* License Number (read-only) */}
            <FormField
              control={form.control}
              name="license_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>License Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your medical license number" {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Years of Experience */}
            <FormField
              control={form.control}
              name="years_of_experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Years of Experience</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" max="60" placeholder="Enter years of experience" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Qualifications */}
            <FormField
              control={form.control}
              name="qualifications"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Qualifications</FormLabel>
                  <FormControl>
                    <Textarea placeholder="List your medical qualifications and certifications" className="min-h-[100px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Bio */}
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Professional Bio</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Write a brief professional biography" className="min-h-[150px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Specialization (read-only) */}
            <FormField
              control={form.control}
              name="specialization_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specialization</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your specialization" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {specializations.map((spec) => (
                        <SelectItem key={spec.id} value={spec.id.toString()}>
                          {spec.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                  <p className="text-xs text-slate-500">Contact administration to update your specialization.</p>
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" type="button" onClick={() => form.reset()} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default ProfessionalSettings; 