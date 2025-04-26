import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
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
import { updateProfile, uploadAvatar, getUserProfile } from '@/api/settings';
import { useAuth } from '@/contexts/Auth/useAuth';
import axiosInstance from '@/lib/axios';

const formSchema = z.object({
  first_name: z.string()
    .min(2, 'First name must be at least 2 characters')
    .nonempty('First name is required'),
  last_name: z.string()
    .min(2, 'Last name must be at least 2 characters')
    .nonempty('Last name is required'),
  email: z.string()
    .email('Invalid email address')
    .nonempty('Email is required'),
  status: z.enum(['available', 'onBreak', 'withPatient']).optional(),
});

function ProfileSettings() {
  const { user, updateUser } = useAuth();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      status: 'available',
    },
  });

  const fileInputRef = useRef(null);
  const [avatarUrl, setAvatarUrl] = useState('');
  const fullName = `${form.watch('first_name')} ${form.watch('last_name')}`;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isDoctor = user?.role === 'doctor';

  useEffect(() => {
    if (user) {
      form.reset({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        status: isDoctor ? (user.status || 'available') : undefined,
      });
      setAvatarUrl(user.avatar || '');
    }
  }, [user, form, isDoctor]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Prepare all required user fields for PUT
      const userData = {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        status: isDoctor ? (data.status || 'available') : undefined,
      };
      // Remove undefined fields
      Object.keys(userData).forEach(key => userData[key] === undefined && delete userData[key]);

      // Use PUT instead of PATCH
      await axiosInstance.put('/auth/users/me/', userData);
      const updatedUser = await getUserProfile();
      if (updateUser) updateUser(updatedUser);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile', {
        description: error.message || 'Please try again'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File too large', {
          description: 'Please select an image smaller than 2MB'
        });
        return;
      }
      if (!file.type.match('image.*')) {
        toast.error('Invalid file type', {
          description: 'Please select an image file (JPG, PNG, GIF)'
        });
        return;
      }

      try {
        const response = await uploadAvatar(file);
        setAvatarUrl(response.avatar_url);
        toast.success('Avatar updated successfully');
      } catch (error) {
        toast.error('Failed to update avatar', {
          description: error.message || 'Please try again'
        });
      }
    }
  };

  const handleCancel = () => {
    if (user) {
      form.reset({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        status: isDoctor ? (user.status || 'available') : undefined,
      });
    }
    toast.info('Changes discarded');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Update your personal details and information</CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={avatarUrl} alt={fullName} />
                <AvatarFallback>
                  {fullName?.split(' ').map((n) => n[0]).join('') || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <i className="fas fa-upload mr-2"></i> Change Avatar
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                />
                <p className="text-xs text-slate-500 mt-2">JPG, GIF or PNG. Max size of 2MB.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isDoctor && (
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="onBreak">On Break</SelectItem>
                        <SelectItem value="withPatient">With Patient</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default ProfileSettings;