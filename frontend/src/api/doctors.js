import axiosInstance from '@/lib/axios';

/**
 * Get all doctors with optional search query
 * @param {string} query - Search query for filtering doctors
 * @returns {Promise<Array>} - List of doctors
 */
export const getDoctors = async (query = '') => {
  const response = await axiosInstance.get('/doctors/doctorsList/', {
    params: { search: query },
  });
  return response.data;
};

/**
 * Create a new doctor
 * @param {Object} doctorData - Doctor data to create
 * @returns {Promise<Object>} - Created doctor
 */
export const createDoctor = async (doctorData) => {
  const response = await axiosInstance.post('/doctors/doctorsList/', doctorData);
  return response.data;
};

/**
 * Update an existing doctor
 * @param {number} id - Doctor ID
 * @param {Object} doctorData - Updated doctor data
 * @returns {Promise<Object>} - Updated doctor
 */
export const updateDoctor = async (id, doctorData) => {
  const response = await axiosInstance.patch(`/doctors/doctorsList/${id}/`, doctorData);
  return response.data;
};

/**
 * Delete a doctor
 * @param {number} id - Doctor ID
 * @returns {Promise<void>}
 */
export const deleteDoctor = async (id) => {
  await axiosInstance.delete(`/doctors/doctorsList/${id}/`);
};

/**
 * Get all specializations
 * @returns {Promise<Array>} - List of specializations
 */
export const getSpecializations = async () => {
  const response = await axiosInstance.get('/doctors/specializations/');
  return response.data;
};
