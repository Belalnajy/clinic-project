import axiosInstance from '@/lib/axios';

export const getPatientPrescriptions = async (page = 1, patientId) => {
  const response = await axiosInstance.get(
    `/prescriptions/by-patient/?page=${page}&patient_id=${patientId}&page_size=2`
  );
  return response.data;
};

export const createPrescription = async (medicalRecordId) => {
  const response = await axiosInstance.post('/prescriptions/', {
    medical_record_id: medicalRecordId,
  });
  return response.data;
};

export const addMedicationsToPrescription = async (prescriptionId, medications) => {
  const response = await axiosInstance.post('/prescription-medications/', {
    prescription_id: prescriptionId,
    medications: medications,
  });
  return response.data;
};
