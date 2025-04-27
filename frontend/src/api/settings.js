import axiosInstance from '@/lib/axios';

const API_BASE_URL = import.meta.env.DEV
  ? '/api'
  : import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const getUserProfile = async (userId) => {
  try {
    const response = await axiosInstance.get(`/auth/users/me/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateStatus = async (userId, status) => {
  try {
    const response = await axiosInstance.patch(`/auth/users/${userId}/`, { status });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.status?.[0] || error.response?.data || error.message;
    throw errorMessage;
  }
};

export const updateDoctorProfilePicture = async (doctorId, file) => {
  try {
    const formData = new FormData();
    formData.append('profile_picture', file);
    const response = await axiosInstance.patch(`/doctors/doctorsList/${doctorId}/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updatePassword = async (userId, passwordData) => {
  try {
    const response = await axiosInstance.post(`/auth/users/${userId}/set_password/`, passwordData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// export const deleteAccount = async () => {
//   try {
//     const response = await axiosInstance.delete('/auth/users/me/');
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || error.message;
//   }
// };

export const uploadAvatar = async (userId, file) => {
  try {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await axiosInstance.patch(`/auth/users/${userId}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getDoctorProfileByUserId = async (userId) => {
  try {
    const response = await axiosInstance.get(`/doctors/doctorsList/by_user_id/?user_id=${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateDoctorProfile = async (doctorId, doctorData) => {
  try {
    const response = await axiosInstance.patch(`/doctors/doctorsList/${doctorId}/`, doctorData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
