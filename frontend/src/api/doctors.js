import axiosInstance from '@/lib/axios';

/**
 * Get all doctors with optional search query and pagination
 * @param {string} query - Search query for filtering doctors
 * @param {number} page - Page number (1-based)
 * @param {number} pageSize - Number of items per page
 * @returns {Promise<Object>} - Paginated response with results and count
 */
export const getDoctors = async (query = '', page = 1, pageSize = 10) => {
  const response = await axiosInstance.get('/doctors/doctorsList/', {
    params: {
      search: query,
      page,
      page_size: pageSize,
    },
  });
  return {
    results: response.data.results || [],
    count: response.data.count || 0,
  };
};

/**
 * Toggle doctor's active status
 * @param {number} id - Doctor ID
 * @param {boolean} isActive - New active status
 * @returns {Promise<Object>} - Updated doctor
 */
export const toggleDoctorStatus = async (id, isActive) => {
  const response = await axiosInstance.patch(`/doctors/doctorsList/${id}/`, {
    is_active: isActive,
  });
  return response.data;
};

/**
 * Get all specializations
 * @returns {Promise<Array>} - List of specializations
 */
export const getSpecializations = async () => {
  const response = await axiosInstance.get('/doctors/specializations/');
  return response.data;
};

export const getAllDoctors = async () => {
  const response = await axiosInstance.get('/doctors/doctorsList/all-doctors');
  return response.data;
};
