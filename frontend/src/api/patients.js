import axiosInstance from '@/lib/axios';

/**
 * Get all patients with pagination and optional search
 * @param {number} page - Page number
 * @param {string} search - Search term
 * @returns {Promise<Object>} - Paginated patients data
 */
export const getPatients = async (page = 1, search = '') => {
  const response = await axiosInstance.get('/patients/patients/', {
    params: { page, search },
  });
  return response.data;
};

/**
 * Get a single patient by ID
 * @param {string} id - Patient ID
 * @returns {Promise<Object>} - Patient data
 */
export const getPatient = async (id) => {
  const response = await axiosInstance.get(`/patients/patients/${id}/`);
  return response.data;
};

/**
 * Create or update a patient
 * @param {Object} data - Patient data
 * @param {string} [id] - Patient ID (optional for updates)
 * @returns {Promise<Object>} - Created or updated patient data
 */
export const savePatient = async (data, id = null) => {
  if (id) {
    const response = await axiosInstance.put(`/patients/patients/${id}/`, data);
    return response.data;
  } else {
    const response = await axiosInstance.post('/patients/patients/', data);
    return response.data;
  }
};

/**
 * Delete a patient by ID
 * @param {string} id - Patient ID
 * @returns {Promise<void>} - Deletes the patient
 */
export const deletePatient = async (id) => {
  const response = await axiosInstance.delete(`/patients/patients/${id}/`);
  return response.data;
};

/**
 * Get all deactivated patients
 * @returns {Promise<Array>} - List of deactivated patients
 */
export const getDeactivatedPatients = async () => {
  const response = await axiosInstance.get('/patients/patients/deactivated/');
  return response.data;
};

/**
 * Toggle patient's active status
 * @param {number} id - Patient ID
 * @param {boolean} isActive - New active status
 * @returns {Promise<Object>} - Updated patient
 */
export const togglePatientStatus = async (id, isActive) => {
  const response = await axiosInstance.patch(`/patients/patients/${id}/`, {
    is_active: isActive,
  });
  return response.data;
};

/**
 * Activate a deactivated patient
 * @param {number} id - Patient ID
 * @returns {Promise<Object>} - Activated patient
 */
export const activatePatient = async (id) => {
  const response = await axiosInstance.post(`/patients/patients/${id}/activate/`);
  return response.data;
};
