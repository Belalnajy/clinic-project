import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/Auth/useAuth';

const RootRedirect = () => {
  const { user } = useAuth();
  console.log(user);
  return <Navigate to={`/dashboard/${user?.role || 'manager'}`} replace />;
};

export default RootRedirect;
