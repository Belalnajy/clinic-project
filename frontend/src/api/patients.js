import axiosInstance from '@/lib/axios';

/**
 * Get list of patients with optional search and filters
 * @param {Object} params - Query parameters
 * @param {string} [params.search] - Search query for patient name
 * @param {boolean} [params.is_active] - Filter by active status
 * @param {number} [params.page=1] - Page number
 * @returns {Promise<Object>} - Paginated response with patients data
 */
export const getPatients = async ({ search, is_active, page } = {}) => {
  const response = await axiosInstance.get('/patients/', {
    params: {
      search,
      is_active,
      page,
    },
  });
  return response.data;
};

export const getPatient = async (patientId) => {
  const response = await axiosInstance.get(`/patients/${patientId}/`);
  return response.data;
};

export const createPatient = async (data) => {
  const response = await axiosInstance.post('/patients/', data);
  return response.data;
};

export const updatePatient = async (patientId, data) => {
  const response = await axiosInstance.patch(`/patients/${patientId}/`, data);
  return response.data;
};

export const deletePatient = async (patientId) => {
  await axiosInstance.delete(`/patients/${patientId}/`);
};

export const reActivatePatient = async (patientId) => {
  const response = await axiosInstance.post(`/patients/${patientId}/reactivate/`, {
    is_active: true,
  });
  return response.data;
};
