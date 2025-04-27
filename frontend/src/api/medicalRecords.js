import axiosInstance from '@/lib/axios';

/**
 * Get all medical records (with optional pagination)
 * @param {number} page - Page number
 * @returns {Promise<Object>} - Paginated medical records data
 */
export const getMedicalRecords = async (page = 1) => {
  const response = await axiosInstance.get('/medical-records/', {
    params: { page },
  });
  return response.data;
};

/**
 * Get a single medical record by ID
 * @param {string|number} id - Medical record ID
 * @returns {Promise<Object>} - Medical record data
 */
export const getMedicalRecord = async (id) => {
  const response = await axiosInstance.get(`/medical-records/${id}/`);
  return response.data;
};
