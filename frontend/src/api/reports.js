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
 * Fetch count of available doctors
 * @returns {Promise<Object>} - Object containing count of available doctors
 */
export const getAvailableDoctorsCount = async () => {
  const response = await axiosInstance.get('/reports/available-doctors/');
  return response.data;
};

/**
 * Fetch all doctors
 * @returns {Promise<Array>} - List of doctors with id and name
 */
export const getDoctors = async () => {
  const response = await axiosInstance.get('/doctors/doctors/');
  return response.data;
};

/**
 * Fetch all specializations
 * @returns {Promise<Array>} - List of specializations with id and name
 */
export const getSpecializations = async () => {
  const response = await axiosInstance.get('/doctors/specializations-list/');
  return response.data;
};

/**
 * Fetch appointments with pagination and filters
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {string} [params.doctor] - Doctor ID to filter by
 * @param {string} [params.specialization] - Specialization ID to filter by
 * @param {string} [params.status] - Status to filter by
 * @param {Date} [params.date] - Date to filter by
 * @returns {Promise<Object>} - Paginated appointments data
 */
export const getAppointments = async ({ page = 1, doctor, specialization, status, date } = {}) => {
  // Helper to format date as YYYY-MM-DD using local time
  const formatLocalDate = (dateObj) => {
    if (!dateObj) return undefined;
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  let dateParams = {};
  if (date) {
    if (typeof date === 'object' && date.startDate && date.endDate) {
      // Date range
      dateParams = {
        appointment_date__gte: formatLocalDate(date.startDate),
        appointment_date__lte: formatLocalDate(date.endDate),
      };
    } else if (date instanceof Date) {
      // Single date
      const formatted = formatLocalDate(date);
      dateParams = {
        appointment_date__gte: formatted,
        appointment_date__lte: formatted,
      };
    }
  }

  const response = await axiosInstance.get('/appointments/', {
    params: {
      page,
      page_size: 8,
      ...(doctor && { doctor }),
      ...(specialization && { specialization }),
      ...(status && { status }),
      ...dateParams,
    },
  });
  return response.data;
};
