import axiosInstance from '@/lib/axios';

const API_BASE_URL = import.meta.env.DEV
  ? '/api'
  : import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const getUserProfile = async () => {
  try {
    const response = await axiosInstance.get('/auth/users/me/');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateStatus = async (status) => {
  try {
    const response = await axiosInstance.put('/auth/users/me/', { status });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.status?.[0] || error.response?.data || error.message;
    throw errorMessage;
  }
};

export const updateProfile = async (profileData) => {
  try {
    // Convert the data to FormData if it contains a file
    const formData = new FormData();
    Object.keys(profileData).forEach((key) => {
      if (profileData[key] instanceof File) {
        formData.append(key, profileData[key]);
      } else if (profileData[key] !== undefined && profileData[key] !== null) {
        formData.append(key, profileData[key]);
      }
    });

    const response = await axiosInstance.put('/auth/users/me/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateDoctorProfile = async (doctorData) => {
  try {
    const formData = new FormData();
    Object.keys(doctorData).forEach((key) => {
      if (doctorData[key] instanceof File) {
        formData.append(key, doctorData[key]);
      } else if (doctorData[key] !== undefined && doctorData[key] !== null) {
        formData.append(key, doctorData[key]);
      }
    });

    const response = await axiosInstance.put('/doctors/me/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updatePassword = async (passwordData) => {
  try {
    const response = await axiosInstance.post('/auth/users/set_password/', passwordData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteAccount = async () => {
  try {
    const response = await axiosInstance.delete('/auth/users/me/');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const uploadAvatar = async (file) => {
  try {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await axiosInstance.put('/auth/users/me/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
