import axiosInstance from '@/lib/axios';

/**
 * Get all medications with pagination
 * @param {number} page - Page number
 * @returns {Promise<Object>} - Paginated medications data
 */
export const getMedications = async (page = 1) => {
  const response = await axiosInstance.get('/medications/', {
    params: {
      page,
    },
  });
  return response.data;
};

/**
 * Get a single medication by ID
 * @param {string} id - Medication ID
 * @returns {Promise<Object>} - Medication data
 */
export const getMedication = async (id) => {
  const response = await axiosInstance.get(`/medications/${id}/`);
  return response.data;
};

/**
 * Create a new medication
 * @param {Object} data - Medication data
 * @returns {Promise<Object>} - Created medication data
 */
export const createMedication = async (data) => {
  const response = await axiosInstance.post('/medications/', data);
  return response.data;
};

/**
 * Update a medication
 * @param {string} id - Medication ID
 * @param {Object} data - Updated medication data
 * @returns {Promise<Object>} - Updated medication data
 */
export const updateMedication = async (id, data) => {
  console.log(data);
  console.log(id);
  const response = await axiosInstance.put(`/medications/${id}/`, data);
  return response.data;
};

/**
 * Delete a medication
 * @param {string} id - Medication ID
 * @returns {Promise<void>}
 */
export const deleteMedication = async (id) => {
  await axiosInstance.delete(`/medications/${id}/`);
};
