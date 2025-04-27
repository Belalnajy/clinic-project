import axiosInstance from '@/lib/axios';

// Fetch all patients (with optional pagination)
export const getPatients = async (page = 1) => {
  const response = await axiosInstance.get('/patients/patients/', {
    params: { page },
  });
  return response.data;
};

// Fetch a single patient by ID
export const getPatientById = async (id) => {
  const response = await axiosInstance.get(`/patients/patients/${id}/`);
  return response.data;
};
