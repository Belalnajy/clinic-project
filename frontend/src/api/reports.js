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
 * @returns {Promise<Array>} - List of doctors
 */
export const getDoctors = async () => {
  const response = await axiosInstance.get('/doctors/doctorsList/');
  return response.data;
};

/**
 * Fetch all specializations
 * @returns {Promise<Array>} - List of specializations
 */
export const getSpecializations = async () => {
  const response = await axiosInstance.get('/doctors/specializations/');
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
 * @param {string} [params.status] - Status to filter by
 * @param {string} [params.date_filter] - Date filter value
 * @returns {Promise<Object>} - Paginated appointments data
 */
export const getAppointments = async ({ page = 1, doctor, status, date_filter } = {}) => {
  const dateRange = date_filter ? getDateRange(date_filter) : null;

  const response = await axiosInstance.get('/appointments/', {
    params: {
      page,
      page_size: 8,
      ...(doctor && { doctor }),
      ...(status && { status }),
      ...(dateRange && {
        appointment_date_after: dateRange.start_date,
        appointment_date_before: dateRange.end_date
      }),
    },
  });
  return response.data;
};