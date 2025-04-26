import axiosInstance from '@/lib/axios';

export const specializationsApi = {
  // Get all specializations
  getAll: async () => {
    const response = await axiosInstance.get('/doctors/specializations/');
    return response.data;
  },

  // Create a new specialization
  create: async (data) => {
    const response = await axiosInstance.post('/doctors/specializations/', data);
    return response.data;
  },

  // Delete a specialization
  delete: async (id) => {
    const response = await axiosInstance.delete(`/doctors/specializations/${id}/`);
    return response.data;
  },
};
