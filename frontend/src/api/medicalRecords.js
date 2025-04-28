import axiosInstance from '@/lib/axios';

export const getMedicalRecords = async (page = 1, patientId) => {
  const response = await axiosInstance.get(
    `/medical-records/?page=${page}${patientId ? `&patient=${patientId}` : ''}`
  );
  return response.data;
};

export const getMedicalRecord = async (id) => {
  const response = await axiosInstance.get(`/medical-records/${id}/`);
  return response.data;
};

export const getLatestMedicalRecord = async (patientId) => {
  const response = await axiosInstance.get(`/medical-records/${patientId}/latest/`);
  return response.data;
};

export const createMedicalRecord = async (data) => {
  const response = await axiosInstance.post('/medical-records/', data);
  return response.data;
};

export const updateMedicalRecord = async (id, data) => {
  const response = await axiosInstance.put(`/medical-records/${id}/`, data);
  return response.data;
};

export const deleteMedicalRecord = async (id) => {
  const response = await axiosInstance.delete(`/medical-records/${id}/`);
  return response.data;
};
