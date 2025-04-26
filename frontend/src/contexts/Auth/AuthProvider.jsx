import { useEffect, useState, useCallback } from 'react';
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
      const userData = response.data;
      
      // Set default available statuses based on role if not provided
      if (!userData.available_statuses) {
        userData.available_statuses = userData.role === 'doctor' 
          ? [
              { value: 'available', label: 'Available' },
              { value: 'onBreak', label: 'On Break' },
              { value: 'withPatient', label: 'With Patient' }
            ]
          : [
              { value: 'available', label: 'Available' },
              { value: 'onBreak', label: 'On Break' }
            ];
      }

      setUser(userData);
      setIsAuthenticated(true);

      // Sync status to localStorage for cross-tab communication
      localStorage.setItem('userStatus', userData.status);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // Function to update user data in context and sync with backend
  const updateUserData = useCallback(async (updates) => {
    try {
      // If we're updating status, sync with backend
      if ('status' in updates) {
        await axiosInstance.patch('/auth/users/me/', { status: updates.status });
        localStorage.setItem('userStatus', updates.status);
      }

      // Update local state
      setUser((currentUser) => ({
        ...currentUser,
        ...updates,
      }));
    } catch (error) {
      console.error('Failed to update user data:', error);
      throw error;
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      if (checkAuth()) {
        await fetchUserData();
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  // Subscribe to status updates from other tabs/windows
  useEffect(() => {
    const handleStorageChange = async (e) => {
      if (e.key === 'userStatus' && user && e.newValue !== user.status) {
        try {
          await updateUserData({ status: e.newValue });
        } catch (error) {
          console.error('Failed to sync status across tabs:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [user, updateUserData]);

  // Periodic status sync (every 30 seconds)
  useEffect(() => {
    if (!isAuthenticated) return;

    const syncInterval = setInterval(fetchUserData, 30000);
    return () => clearInterval(syncInterval);
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser: updateUserData,
        isLoading,
        isAuthenticated,
        setIsAuthenticated,
        fetchUserData,
      }}
    >
      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
