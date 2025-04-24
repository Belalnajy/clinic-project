import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';
import { useAuth } from '@/contexts/Auth/useAuth';

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const getDashboardPath = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'doctor':
        return '/dashboard/doctor';
      case 'secretary':
        return '/dashboard/secretary';
      case 'manager':
        return '/dashboard/manager';
      default:
        return '/login';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full mx-auto p-6 text-center">
        <div className="mb-8">
          <ShieldAlert className="h-16 w-16 text-destructive mx-auto" />
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-4">Access Denied</h1>

        <p className="text-muted-foreground mb-8">
          You don't have permission to access this page. Please contact your administrator if you
          believe this is a mistake.
        </p>

        <div className="space-y-4">
          <Button onClick={() => navigate(getDashboardPath())} className="w-full">
            Go to My Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
