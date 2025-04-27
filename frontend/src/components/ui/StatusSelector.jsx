import React, { useState, useContext, useEffect } from 'react';
import AuthContext from '@/contexts/Auth/context';
import { cn } from '@/lib/utils';

export function StatusSelector() {
  const { user, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Fetch initial status
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('/api/auth/users/me/', {
          method: 'GET',
          headers: {
            'Authorization': `JWT ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch status');
        }

        const userData = await response.json();
        setUser(userData);
      } catch (err) {
        console.error('Failed to fetch status:', err);
        setError(typeof err === 'string' ? err : 'Failed to fetch status');
      } finally {
        setInitialLoading(false);
      }
    };

    if (!user?.status) {
      fetchStatus();
    } else {
      setInitialLoading(false);
    }
  }, [setUser, user]);

  // Clear success/error messages after 3 seconds
  React.useEffect(() => {
    let timeoutId;
    if (success || error) {
      timeoutId = setTimeout(() => {
        setSuccess(false);
        setError(null);
      }, 3000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [success, error]);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.status-selector')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  const handleStatusChange = async (newStatus) => {
    if (newStatus === user?.status) {
      setIsOpen(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/auth/users/me/', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `JWT ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.status?.[0] || 'Failed to update status');
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      setSuccess(true);
      setIsOpen(false);
    } catch (err) {
      console.error('Failed to update status:', err);
      setError(typeof err === 'string' ? err : 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (currentStatus) => {
    switch (currentStatus) {
      case 'available':
        return 'bg-green-500';
      case 'onBreak':
        return 'bg-yellow-500';
      case 'withPatient':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusStyles = (isSelected) => {
    return cn(
      'flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors w-full text-left',
      isSelected ? 'bg-primary-50' : 'hover:bg-gray-100',
      loading && 'opacity-50 cursor-not-allowed'
    );
  };

  if (initialLoading) {
    return (
      <div className="flex items-center space-x-2 text-sm text-primary-600">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-600 border-t-transparent"></div>
        <span>Loading status...</span>
      </div>
    );
  }

  if (!user || !user.available_statuses) {
    return null;
  }

  return (
    <div className="flex flex-col space-y-2 status-selector">
      <div className="flex items-center space-x-4">
        <label className="text-sm font-medium">Status:</label>
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            disabled={loading}
            className="flex items-center space-x-2 min-w-[150px] p-2 border rounded-md hover:bg-gray-50 transition-colors"
          >
            <div className={`h-3 w-3 rounded-full ${getStatusColor(user.status)}`} />
            <span className="text-sm">
              {user.available_statuses.find(s => s.value === user.status)?.label || 'Unknown'}
            </span>
          </button>

          {isOpen && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden z-50">
              {user.available_statuses.map((statusOption) => (
                <button
                  key={statusOption.value}
                  onClick={() => handleStatusChange(statusOption.value)}
                  className={getStatusStyles(statusOption.value === user.status)}
                  disabled={loading}
                >
                  <div className={`h-2 w-2 rounded-full ${getStatusColor(statusOption.value)}`} />
                  {statusOption.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {loading && (
        <div className="flex items-center space-x-2 text-sm text-primary-600">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-600 border-t-transparent"></div>
          <span>Updating status...</span>
        </div>
      )}
      {error && (
        <span className="text-sm text-red-600">{error}</span>
      )}
      {success && (
        <span className="text-sm text-green-600">Status updated successfully</span>
      )}
    </div>
  );
} 