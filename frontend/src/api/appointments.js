import axiosInstance from '@/lib/axios';

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
