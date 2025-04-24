import { useContext } from 'react';
import AuthContext from './context';
import { toast } from 'sonner';
import { login as apiLogin, logout as apiLogout } from '@/api/auth';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const { user, setUser, isLoading, isAuthenticated, setIsAuthenticated, fetchUserData } = context;

  const login = async (credentials) => {
    try {
      // Call the API login function
      await apiLogin(credentials.email, credentials.password);

      // Fetch user data after successful login
      await fetchUserData();

      toast.success('Welcome back!', {
        description: "You've successfully logged in.",
      });
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Login failed', {
        description: error.response?.data?.detail || 'Invalid email or password.',
      });
      return false;
    }
  };

  const logout = () => {
    apiLogout();
    setUser(null);
    setIsAuthenticated(false);
    toast('Goodbye!', {
      description: 'You have been successfully logged out',
    });
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
  };
};
