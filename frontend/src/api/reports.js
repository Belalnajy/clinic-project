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
 * Get date range based on filter value
 * @param {string} dateFilter - The date filter value
 * @returns {Object} - Start and end dates
 */
const getDateRange = (dateFilter) => {
  const today = new Date();
  const startDate = new Date();
  const endDate = new Date();

  switch (dateFilter) {
    case 'today':
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      break;
    case 'yesterday':
      startDate.setDate(today.getDate() - 1);
      startDate.setHours(0, 0, 0, 0);
      endDate.setDate(today.getDate() - 1);
      endDate.setHours(23, 59, 59, 999);
      break;
    case 'this_week':
      startDate.setDate(today.getDate() - today.getDay());
      startDate.setHours(0, 0, 0, 0);
      endDate.setDate(today.getDate() + (6 - today.getDay()));
      endDate.setHours(23, 59, 59, 999);
      break;
    case 'last_week':
      startDate.setDate(today.getDate() - today.getDay() - 7);
      startDate.setHours(0, 0, 0, 0);
      endDate.setDate(today.getDate() - today.getDay() - 1);
      endDate.setHours(23, 59, 59, 999);
      break;
    case 'this_month':
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
      endDate.setMonth(today.getMonth() + 1);
      endDate.setDate(0);
      endDate.setHours(23, 59, 59, 999);
      break;
    case 'last_month':
      startDate.setMonth(today.getMonth() - 1);
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
      endDate.setDate(0);
      endDate.setHours(23, 59, 59, 999);
      break;
    default:
      return null;
  }

  return {
    start_date: startDate.toISOString().split('T')[0],
    end_date: endDate.toISOString().split('T')[0],
  };
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