// API call to fetch dashboard statistics from the backend
import axiosInstance from '@/lib/axios';

export const getDashboardStatistics = async () => {
  const response = await axiosInstance.get('/patients/patients/statistics/');
  return response.data;
};
