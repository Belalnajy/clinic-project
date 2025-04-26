import { z } from 'zod';
import { BaseRegisterForm } from './base-register-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Loader2, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from 'axios';

// File validation constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const doctorFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  first_name: z.string().min(2),
  last_name: z.string().min(2),
  role: z.string(),
  specialization_id: z.string().min(1, "Please select a specialization"),
  license_number: z.string().min(5, "License number must be at least 5 characters"),
  years_of_experience: z.string().min(1, "Years of experience is required"),
  qualifications: z.string().min(5, "Qualifications must be at least 5 characters"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  profile_picture: z.any().optional()
});

function DoctorFields() {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [specializations, setSpecializations] = useState([]);
  const [isLoadingSpecializations, setIsLoadingSpecializations] = useState(true);
  const form = useFormContext();

  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        setIsLoadingSpecializations(true);
        const response = await axios.get('/api/doctors/specializations/');
        if (response.data) {
          setSpecializations(response.data.results || response.data);
        } else {
          console.error('No data received from specializations endpoint');
          setSpecializations([]);
        }
      } catch (error) {
        console.error('Error fetching specializations:', error);
        if (error.response) {
          console.error('Server response:', error.response.data);
        }
        setSpecializations([]);
      } finally {
        setIsLoadingSpecializations(false);
      }
    };

    fetchSpecializations();
  }, []);

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
        name="specialization_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Specialization</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={isLoadingSpecializations ? "Loading..." : "Select a specialization"} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {isLoadingSpecializations ? (
                  <SelectItem value="loading" disabled>Loading specializations...</SelectItem>
                ) : specializations.length === 0 ? (
                  <SelectItem value="no_specializations" disabled>No specializations available</SelectItem>
                ) : (
                  specializations.map((specialization) => (
                    <SelectItem key={specialization.id} value={specialization.id.toString()}>
                      {specialization.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="license_number"
        render={({ field }) => (
          <FormItem>
            <FormLabel>License Number</FormLabel>
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
              <Input 
                type="number" 
                min="0" 
                max="60" 
                placeholder="Enter years of experience" 
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
                placeholder="Enter your qualifications" 
                {...field} 
              />
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
                placeholder="Tell us about yourself" 
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