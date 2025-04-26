import axiosInstance from '@/lib/axios';

export const getPatientPrescriptions = async (page = 1, patientId) => {
  const response = await axiosInstance.get(
    `/prescriptions/by-patient/?page=${page}&patient_id=${patientId}`
  );
  return response.data;
};

export const createPrescription = async (medicalRecordId) => {
  const response = await axiosInstance.post('/medical-records/', {
    medical_record_id: medicalRecordId,
  });
  return response.data;
};

export const addMedicationsToPrescription = async (data) => {
  const response = await axiosInstance.post('/prescription-medications/', data);
  return response.data;
};
