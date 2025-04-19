import { useContext } from 'react';
import AuthContext from './context';
import { toast } from 'sonner';
import { getUsers } from '@/components/login/login-data';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const { user, setUser, isLoading, isAuthenticated, setIsAuthenticated } = context;

  const login = (userData) => {
    const users = getUsers();
    const foundUser = users.find(
      (user) => user.email === userData.email && user.password === userData.password
    );

    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      console.log('Login successful:', foundUser);
      toast.success(`welcome back, ${foundUser.name}`, {
        description: "Here's your schedule for today",
      });
      return true;
    } else {
      console.error('Invalid email or password');
      toast.error('something went wrong', {
        description: 'Invalid email or password.',
      });
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
    console.log('Logged out');
    toast('GoodBye !', {
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
