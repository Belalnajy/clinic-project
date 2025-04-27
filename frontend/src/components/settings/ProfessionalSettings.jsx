import { useState, useEffect } from 'react';
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
import { getDoctorProfileByUserId, updateDoctorProfile } from '@/api/settings';

const formSchema = z.object({
  license_number: z.string().min(5, 'License number must be at least 5 characters').optional().or(z.literal('')),
  years_of_experience: z.coerce.number().min(0, 'Years of experience must be 0 or greater').max(60, 'Years of experience must be less than 60').optional().or(z.literal('')),
  qualifications: z.string().min(5, 'Qualifications must be at least 5 characters').optional().or(z.literal('')),
  bio: z.string().min(10, 'Bio must be at least 10 characters').optional().or(z.literal('')),
  specialization_id: z.string().optional(),
});

function ProfessionalSettings() {
  const { user } = useAuth();
  const [doctorId, setDoctorId] = useState(null);
  const [specializations, setSpecializations] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
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

  // Fetch specializations (unchanged)
  useEffect(() => {
    const fetchSpecializations = debounce(async () => {
      try {
        const response = await import('@/lib/axios').then(m => m.default.get('/doctors/specializations/'));
        setSpecializations(response.data);
      } catch (error) {
        toast.error('Failed to fetch specializations');
      }
    }, 300);
    fetchSpecializations();
    return () => fetchSpecializations.cancel();
  }, []);

  // Fetch doctor profile on mount
  useEffect(() => {
    const fetchDoctorProfile = async () => {
      if (!user?.id) return;
      try {
        const doctor = await getDoctorProfileByUserId(user.id);
        setDoctorId(doctor.id);
        setProfilePicture(doctor.profile_picture || null);
        form.reset({
          license_number: doctor.license_number || '',
          years_of_experience: doctor.years_of_experience || '',
          qualifications: doctor.qualifications || '',
          bio: doctor.bio || '',
          specialization_id: doctor.specialization?.id?.toString() || '',
        });
      } catch (error) {
        toast.error('Failed to fetch doctor profile');
      }
    };
    fetchDoctorProfile();
  }, [user?.id, form]);

  // Update only doctor fields
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      if (!doctorId) throw new Error('Doctor profile not found');
      const doctorData = {
        years_of_experience: data.years_of_experience ? Number(data.years_of_experience) : 0,
        qualifications: data.qualifications?.trim() || '',
        bio: data.bio?.trim() || '',
        specialization: data.specialization_id || null,
      };
      const updatedDoctor = await updateDoctorProfile(doctorId, doctorData);
      form.reset({
        license_number: updatedDoctor.license_number || '',
        years_of_experience: updatedDoctor.years_of_experience || '',
        qualifications: updatedDoctor.qualifications || '',
        bio: updatedDoctor.bio || '',
        specialization_id: updatedDoctor.specialization?.id?.toString() || '',
      });
      toast.success('Professional information updated successfully');
    } catch (error) {
      toast.error('Failed to update professional information', {
        description: error.message || 'Please try again'
      });
    } finally {
      setIsSubmitting(false);
    }
  };


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
            {/* Profile Picture Upload (only for doctor) */}

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