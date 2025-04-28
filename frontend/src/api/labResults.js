import axiosInstance from '@/lib/axios';

/**
 * Get lab results for a specific patient
 * @param {number} patientId - ID of the patient
 * @returns {Promise<Array>} - Array of lab results
 */
export const getPatientLabResults = async (patientId) => {
  const response = await axiosInstance.get(`/lab-results/${patientId}/patient-results/`);
  return response.data;
};

/**
 * Add a new lab result for a patient
 * @param {Object} data - Lab result data
 * @param {number} data.patient_id - ID of the patient
 * @param {string} data.test_name - Name of the test
 * @param {string} data.test_date - Date of the test (YYYY-MM-DD)
 * @param {string} data.notes - Additional notes
 * @param {string} data.results - Test results
 * @returns {Promise<Object>} - Created lab result
 */
export const addLabResult = async (data) => {
  const response = await axiosInstance.post('/lab-results/', data);
  return response.data;
};
