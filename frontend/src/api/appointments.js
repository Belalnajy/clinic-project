import axiosInstance from '../lib/axios';

export const getAppointments = async (page = 1) => {
  const response = await axiosInstance.get('/appointments/', {
    params: { page },
  });
  
  return response.data;
};

export const getAppointment = async (id) => {
  const response = await axiosInstance.get(`/appointments/${id}/`);
  
  return response.data;
}

export const createAppointment = async (data) => {
  const response = await axiosInstance.post('/appointments/', data);
  
  return response.data;
}

export const updateAppointment = async (id, data) => {
  const response = await axiosInstance.put(`/appointments/${id}/`, data);
  
  return response.data;
}

export const deleteAppointment = async (id) => {
  const response = await axiosInstance.delete(`/appointments/${id}/`);
  
  return response.data;
}

export const cancelAppointment = async (id) => {
  const response = await axiosInstance.post(`/appointments/${id}/cancel/`);
  
  return response.data;
}

export const completeAppointment = async (id) => {
  const response = await axiosInstance.post(`/appointments/${id}/complete/`);
  
  return response.data;
}