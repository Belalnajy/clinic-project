import axiosInstance from '@/lib/axios';

// Get today's appointments from the backend
export const getTodayAppointments = async (page = 1) => {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const response = await axiosInstance.get(`/appointments/?appointment_date=${today}&page=${page}`);
  return response.data;
};
