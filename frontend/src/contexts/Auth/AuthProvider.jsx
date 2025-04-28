import { useEffect, useState } from 'react';
import AuthContext from './context';
import { isAuthenticated as checkAuth, getAccessToken } from '@/api/auth';
import axiosInstance from '@/lib/axios';

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchUserData = async () => {
    try {
      const response = await axiosInstance.get('/auth/users/me/');
      const user = response.data;

      if (user.role === 'doctor' || user.role === 'manager') {
        const response = await axiosInstance.get(
          `/doctors/doctorsList/by_user_id?user_id=${user.id}`
        );
        const doctorData = response.data;
        setUser({ ...user, doctor: doctorData });
        setIsAuthenticated(true);
      } else {
        // Secretary role
        setUser(response.data);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      if (checkAuth()) {
        await fetchUserData();
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isLoading,
        isAuthenticated,
        setIsAuthenticated,
        fetchUserData,
      }}
    >
      {isLoading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
