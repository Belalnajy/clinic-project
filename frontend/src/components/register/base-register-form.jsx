import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useAuth } from "@/contexts/Auth/useAuth";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const baseFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
  first_name: z.string().min(1, { message: "First name is required" }),
  last_name: z.string().min(1, { message: "Last name is required" }),
  role: z.enum(["doctor", "secretary"], {
    message: "Please select a valid role"
  })
});

export function BaseRegisterForm({
  className,
  role,
  children,
  formSchema = baseFormSchema,
  ...props
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      first_name: "",
      last_name: "",
      role: role,
      specialization_id: "",
      license_number: "",
      years_of_experience: "",
      qualifications: "",
      bio: "",
      profile_picture: null
    }
  });

  const handleSubmit = async data => {
    try {
      setIsSubmitting(true);

      if (data.role === 'doctor') {
        // For doctors, use the new registration endpoint
        const formData = new FormData();
        
        // Add user fields
        formData.append('email', data.email);
        formData.append('password', data.password);
        formData.append('first_name', data.first_name);
        formData.append('last_name', data.last_name);
        
        // Add doctor fields
        if (data.specialization_id) {
          formData.append('specialization', data.specialization_id);
        }
        if (data.license_number) {
          formData.append('license_number', data.license_number);
        }
        if (data.years_of_experience) {
          formData.append('years_of_experience', data.years_of_experience);
        }
        if (data.bio) {
          formData.append('bio', data.bio);
        }
        if (data.qualifications) {
          formData.append('qualifications', data.qualifications);
        }
        if (data.profile_picture) {
          formData.append('profile_picture', data.profile_picture);
        }

        try {
          const response = await axios.post('/api/doctors/doctorsList/register/', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          console.log('Doctor registered successfully:', response.data);
          toast.success('Registration successful! Welcome to the clinic.');
          navigate('/');
        } catch (error) {
          console.error('Error registering doctor:', error);
          if (error.response) {
            console.error('Error response:', error.response.data);
            toast.error(error.response.data.message || 'Failed to register. Please try again.');
          }
          throw error;
        }
      } else {
        // For other roles, use the regular registration
        const userFormData = new FormData();
        userFormData.append('email', data.email);
        userFormData.append('password', data.password);
        userFormData.append('first_name', data.first_name);
        userFormData.append('last_name', data.last_name);
        userFormData.append('role', data.role);
        await registerUser(userFormData);
        toast.success('Registration successful! Welcome to the clinic.');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error('Registration failed. Please check your information and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden py-0">
        <CardContent className="grid p-0">
          <Form {...form}>
            <form
              className="p-6 md:p-8"
              onSubmit={form.handleSubmit(handleSubmit)}>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Create an Account</h1>
                  <p className="text-balance text-muted-foreground">
                    Register for a Clinic Management account
                  </p>
                </div>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) =>
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>}
                  />

                  <FormField
                    control={form.control}
                    name="last_name"
                    render={({ field }) =>
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) =>
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="john.doe@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) =>
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>}
                  />

                  {children}

                  <Button
                    type="submit"
                    className="w-full bg-primary"
                    disabled={isSubmitting}>
                    {isSubmitting ? "Registering..." : "Register"}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default BaseRegisterForm;
