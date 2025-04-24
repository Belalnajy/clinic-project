import { z } from 'zod';
import { BaseRegisterForm } from './base-register-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Loader2, X } from 'lucide-react';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

// File validation constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const doctorFormSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
  first_name: z.string().min(1, { message: 'First name is required' }),
  last_name: z.string().min(1, { message: 'Last name is required' }),
  role: z.literal('doctor'),
  license_number: z.string().min(1, { message: 'License number is required' }),
  years_of_experience: z.string().min(1, { message: 'Years of experience is required' }),
  bio: z.string().min(10, { message: 'Bio must be at least 10 characters long' }),
  qualifications: z.string().min(10, { message: 'Qualifications must be at least 10 characters long' }),
  profile_picture: z
    .any()
    .refine((file) => file?.size <= MAX_FILE_SIZE, 'Max file size is 5MB')
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      'Only .jpg, .jpeg, .png and .webp files are accepted'
    ),
});

function DoctorFields() {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const form = useFormContext();

  const handleFileChange = (e, onChange) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsImageLoading(true);
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onChange(file);
      // Simulate loading delay for better UX
      setTimeout(() => {
        setIsImageLoading(false);
      }, 500);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    form.setValue('profile_picture', null);
    // Clear the file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const getInitials = () => {
    const firstName = form.watch('first_name') || '';
    const lastName = form.watch('last_name') || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <>
      <FormField
        name="profile_picture"
        render={({ field: { value, onChange, ...field } }) => (
          <FormItem>
            <FormLabel>Profile Picture</FormLabel>
            <div className="flex flex-col gap-4">
              <div className="flex justify-center">
                {isImageLoading ? (
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : previewUrl ? (
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={previewUrl} alt="Profile preview" />
                      <AvatarFallback>{getInitials()}</AvatarFallback>
                    </Avatar>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -right-2 -top-2 h-6 w-6 rounded-full"
                      onClick={handleRemoveImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                    <span className="text-sm text-muted-foreground">No image</span>
                  </div>
                )}
              </div>
              <FormControl>
                <Input
                  type="file"
                  accept={ACCEPTED_IMAGE_TYPES.join(',')}
                  onChange={(e) => handleFileChange(e, onChange)}
                  {...field}
                />
              </FormControl>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="license_number"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Medical License Number</FormLabel>
            <FormControl>
              <Input placeholder="Enter your medical license number" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="years_of_experience"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Years of Experience</FormLabel>
            <FormControl>
              <Input type="number" min="0" placeholder="Enter years of experience" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="bio"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Bio</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Tell us about yourself and your medical background"
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="qualifications"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Qualifications</FormLabel>
            <FormControl>
              <Textarea
                placeholder="List your medical qualifications and certifications"
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}

export function DoctorRegisterForm({ className, ...props }) {
  return (
    <BaseRegisterForm
      className={className}
      role="doctor"
      formSchema={doctorFormSchema}
      {...props}
    >
      <DoctorFields />
    </BaseRegisterForm>
  );
} 