import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/Auth/useAuth';
import { useState } from 'react';
import { demoAccounts } from './login-data';

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
});

export function LoginForm({ className, ...props }) {
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (credentials) => {
    try {
      setIsSubmitting(true);
      await login(credentials);
      navigate('/dashboard');
    } catch (error) {
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoAccountClick = (role) => {
    const account = demoAccounts.find((account) => account.role === role);
    console.log(account);
    if (account) {
      form.setValue('email', account.email);
      form.setValue('password', account.password);
    }
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="overflow-hidden py-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          {/* Image */}
          <div className="relative hidden bg-muted md:block">
            <img
              src="login-image.png"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover grayscale-50"
            />
          </div>

          {/* Form */}
          <Form {...form}>
            <form className="p-6 md:p-8" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Welcome back</h1>
                  <p className="text-balance text-muted-foreground">
                    Login to your Clinic Management account
                  </p>
                </div>

                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="doctor@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password Field */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full bg-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Logging in...' : 'Login'}
                </Button>
                {/* Dmo Account Buttons */}
                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                  <span className="relative z-10 bg-background px-2 text-muted-foreground">
                    Demo Accounts
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                  <Button
                    type="button"
                    variant="outline"
                    className="py-2"
                    disabled={isSubmitting}
                    onClick={() => handleDemoAccountClick('manager')}
                  >
                    Manager
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="py-2"
                    disabled={isSubmitting}
                    onClick={() => handleDemoAccountClick('doctor')}
                  >
                    Doctor
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="py-2"
                    disabled={isSubmitting}
                    onClick={() => handleDemoAccountClick('secretary')}
                  >
                    Secretary
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a> and{' '}
        <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
