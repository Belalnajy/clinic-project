import axiosInstance from '@/lib/axios';

/**
 * Login with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} - Response data containing access and refresh tokens
 */
export const login = async (email, password) => {
  try {
    const response = await axiosInstance.post('/auth/jwt/create/', {
      email,
      password,
    });

    const { access, refresh } = response.data;

    // Store tokens in localStorage
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);

    return response.data;
  } catch (error) {
    // Clear any existing tokens on login failure
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    throw error;
  }
};

/**
 * Logout the user by clearing stored tokens
 */
export const logout = () => {
  // Clear tokens from localStorage
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

/**
 * Check if user is authenticated
 * @returns {boolean} - True if user has an access token
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('access_token');
};

/**
 * Get the current access token
 * @returns {string|null} - The access token or null if not authenticated
 */
export const getAccessToken = () => {
  return localStorage.getItem('access_token');
};
