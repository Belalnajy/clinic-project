import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from './context';
import { toast } from 'sonner';
import { login as apiLogin, logout as apiLogout, register as apiRegister } from '@/api/auth';

export const useAuth = () => {
  const context = useContext(AuthContext);
  const navigate = useNavigate();

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

      // Use navigate instead of window.location
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Login failed', {
        description: error.response?.data?.detail || 'Invalid email or password.',
      });
    }
  };

  const register = async (formData) => {
    try {
      await apiRegister(formData);

      toast.success('Registration successful!', {
        description: 'Please login with your credentials.',
      });

      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error('Registration failed', {
        description: error.response?.data?.detail || 'Please check your input and try again.',
      });
      throw error;
    }
  };

  const logout = () => {
    apiLogout();
    setUser(null);
    setIsAuthenticated(false);
    toast('Goodbye!', {
      description: 'You have been successfully logged out',
    });
    // Use navigate instead of window.location
    navigate('/login');
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    register,
  };
};
