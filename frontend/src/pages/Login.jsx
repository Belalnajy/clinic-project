import { initializeUsers } from '@/components/login/login-data';
import { LoginForm } from '@/components/login/login-form';
import { useAuth } from '@/contexts/Auth/useAuth';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    initializeUsers();
    if (isAuthenticated) {
      if (user.role === 'manager') {
        navigate('/dashboard/manager');
      } else if (user.role === 'doctor') {
        navigate('/dashboard/doctor');
      } else if (user.role === 'secretary') {
        navigate('/dashboard/secretary');
      }
    }
  }, [isAuthenticated]);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
    </div>
  );
}
