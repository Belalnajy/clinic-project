import {
  patients,
  medicalRecords,
  prescriptions,
  prescriptionMedications,
  labResults,
  doctors,
  users,
  emergencyContacts,
  medications,
} from '@/data/models';

export const getPatientById = (id) => {
  const patient = patients.find((patient) => patient.id === id);
  return patient;
};

function getDoctorNameById(doctorId) {
  const doctor = doctors.find((d) => d.userId === doctorId);
  const user = users.find((u) => u.id === doctor?.userId);
  return user?.username || 'Unknown Doctor';
}

export function getCurrentCondition(patientId) {
  const records = medicalRecords
    .filter((record) => record.patientId === patientId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (records.length === 0) {
    return null;
  }

  const latestRecord = records[0];

  return {
    diagnosis: latestRecord.diagnosis,
    description: latestRecord.description,
    notes: latestRecord.notes,
    recordDate: latestRecord.createdAt,
  };
}

export function getCurrentMedications(patientId) {
  // 1. Find all medical records for the patient
  const patientRecords = medicalRecords
    .filter((record) => record.patientId === patientId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (patientRecords.length === 0) {
    return null;
  }

  // 2. Find latest record
  const latestRecord = patientRecords[0];

  // 3. Find the prescription for that record
  const prescription = prescriptions
    .filter((p) => p.medicalRecordId === latestRecord.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

  if (!prescription) {
    return null;
  }

  // 4. Find medications linked to that prescription
  const meds = prescriptionMedications
    .filter((pm) => pm.prescriptionId === prescription.id)
    .map((pm) => {
      const medInfo = medications.find((med) => med.id === pm.medicationId);
      return {
        name: medInfo?.name || 'Unknown',
        dosage: pm.dosage,
        frequency: pm.frequency,
        duration: pm.duration,
        instructions: pm.instructions,
      };
    });

  if (meds.length === 0) {
    return null;
  }

  return meds;
}

export function getPatientDiagnoses(patientId) {
  return medicalRecords
    .filter((record) => record.patientId === patientId)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)) // Optional: sort chronologically
    .map((record) => ({
      date: record.createdAt,
      diagnosis: record.diagnosis,
      description: record.description,
      notes: record.notes,
    }));
}

export function getPatientLabResults(patientId) {
  const recordIds = medicalRecords
    .filter((record) => record.patientId === patientId)
    .map((record) => record.id);

  return labResults.filter((result) => recordIds.includes(result.medicalRecordId));
}

export function getPrescriptionHistory(patientId) {
  const prescriptionsForPatient = prescriptions.filter((prescription) => {
    const record = medicalRecords.find((r) => r.id === prescription.medicalRecordId);
    return record && record.patientId === patientId;
  });

  function getDoctorNameById(doctorId) {
    const doctor = doctors.find((d) => d.userId === doctorId);
    const user = users.find((u) => u.id === doctor?.userId);
    return user?.username || 'Unknown Doctor';
  }

  return prescriptionsForPatient.map((prescription) => {
    const meds = prescriptionMedications
      .filter((pm) => pm.prescriptionId === prescription.id)
      .map((pm) => {
        const medDetails = medications.find((m) => m.id === pm.medicationId);
        return {
          ...medDetails,
          dosage: pm.dosage,
          frequency: pm.frequency,
          duration: pm.duration,
          instructions: pm.instructions,
        };
      });

    return {
      prescriptionId: prescription.id,
      prescribedBy: {
        id: prescription.prescribedBy,
        name: getDoctorNameById(prescription.prescribedBy),
      },
      createdAt: prescription.createdAt,
      medications: meds,
      status: prescription.status,
      endDate: prescription.endDate,
    };
  });
}

export function getPatientEmergencyContacts(patientId) {
  return emergencyContacts.filter((contact) => contact.patientId === patientId);
}

export function getPrescriptionFormData(patientId) {
  // Fetch medical records for the current patient
  const patientMedicalRecords = medicalRecords.filter((record) => record.patientId === patientId);

  // Get available medications list
  const availableMedications = medications;

  return {
    medicalRecords: patientMedicalRecords,
    medications: availableMedications,
  };
}
