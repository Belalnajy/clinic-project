import axiosInstance from '@/lib/axios';

// Get today's appointments from the backend
export const getTodayAppointments = async (page = 1) => {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const response = await axiosInstance.get(`/appointments/?appointment_date=${today}&page=${page}`);
  return response.data;
};
export const getAppointments = async ({ search, page, startDate, endDate } = {}) => {
  const response = await axiosInstance.get('/appointments', {
    params: { page, search, appointment_date__gte: startDate, appointment_date__lte: endDate },
  });

  console.log('api res: ', response.data);

  return response.data;
};

export const getAppointment = async (id) => {
  const response = await axiosInstance.get(`/appointments/${id}/`);

  return response.data;
};

export const createAppointment = async (data) => {
  const response = await axiosInstance.post('/appointments/', data);

  return response.data;
};

export const updateAppointment = async (id, data) => {
  const response = await axiosInstance.put(`/appointments/${id}/`, data);

  return response.data;
};

export const deleteAppointment = async (id) => {
  const response = await axiosInstance.delete(`/appointments/${id}/`);

  return response.data;
};

export const cancelAppointment = async (id) => {
  const response = await axiosInstance.post(`/appointments/${id}/cancel/`);

  return response.data;
};

export const completeAppointment = async (id) => {
  const response = await axiosInstance.post(`/appointments/${id}/complete/`);

  return response.data;
};

export const getLatestPatientAppointment = async (patientId) => {
  const response = await axiosInstance.get(
    `/appointments/?patient=${patientId}&ordering=-created_at`
  );
  return response.data.results[0] || null;
};

export const markAppointmentAsCompleted = async (appointmentId) => {
  const response = await axiosInstance.post(`/appointments/${appointmentId}/complete/`);
  return response.data;
};
