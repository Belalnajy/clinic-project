import { useState, useRef } from 'react';
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

const formSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .nonempty('Name is required'),
  email: z.string()
    .email('Invalid email address')
    .nonempty('Email is required'),
  phone: z.string()
    .regex(/^(\+20|0)?1[0125]\d{8}$/,
      'Please enter a valid Egyptian phone number (e.g. 01012345678 or +201012345678)')
    .nonempty('Phone number is required'),
  specialization: z.string()
    .nonempty('Specialization is required'),
});

function ProfileSettings() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      specialization: '',
    },
  });

  const fileInputRef = useRef(null);
  const [avatarUrl, setAvatarUrl] = useState('');
  const name = form.watch('name');
  const userRole = form.watch('role') || 'admin';
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    // !for testing
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          console.log('Form submitted:', data);
          resolve(data);
        } catch (error) {
          reject(error);
        }
      }, 1500);
    });

    toast.promise(promise, {
      loading: 'Saving changes...',
      success: (data) => {
        return 'Profile updated successfully';
      },
      error: 'Failed to save changes. Please try again.',
      finally: () => {
        setIsSubmitting(false);
      }
    });
  };

  const handleAvatarChange = (e) => {
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
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
      toast.success('Avatar updated', {
        description: 'Your profile picture has been changed'
      });
    }
  };

  const handleCancel = () => {
    form.reset();
    setAvatarUrl('');
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
                <AvatarImage src={avatarUrl} alt={name} />
                <AvatarFallback>
                  {name?.split(' ').map((n) => n[0]).join('') || 'JD'}
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

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Dr. John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="01012345678 or +201012345678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="specialization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specialization</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Cardiology, Pediatrics, etc."
                        disabled={userRole !== 'admin'}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    {userRole !== 'admin' && (
                      <p className="text-xs text-slate-500">
                        Contact administration to update your specialization.
                      </p>
                    )}
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2 pt-6">
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