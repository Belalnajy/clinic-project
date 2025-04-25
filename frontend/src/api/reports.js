import axiosInstance from '@/lib/axios';

/**
 * Fetch appointment metrics
 * @returns {Promise<Object>} - Appointment metrics data
 */
export const getAppointmentMetrics = async () => {
  const response = await axiosInstance.get('/reports/appointment-metrics/');
  return response.data;
};

/**
 * Fetch patient analysis data
 * @returns {Promise<Object>} - Patient analysis data
 */
export const getPatientAnalysis = async () => {
  const response = await axiosInstance.get('/reports/patients-analysis/');
  return response.data;
};

/**
 * Fetch doctor performance data with pagination
 * @param {number} page - Page number
 * @returns {Promise<Object>} - Paginated doctor performance data
 */
export const getDoctorPerformance = async (page = 1) => {
  const response = await axiosInstance.get('/reports/doctor-performance/', {
    params: {
      page,
    },
  });
  return response.data;
};

/**
 * Fetch appointments with pagination and custom page size
 * @param {number} page - Page number
 * @returns {Promise<Object>} - Paginated appointments data
 */
export const getAppointments = async (page = 1) => {
  const response = await axiosInstance.get('/appointments/', {
    params: {
      page,
      page_size: 8,
    },
  });
  return response.data;
};