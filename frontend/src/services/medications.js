// TODO: Replace with actual API calls
export const getMedicationById = async (id) => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        name: 'Paracetamol',
        default_dosage: '500mg',
        description: 'Pain reliever and fever reducer',
        is_active: true,
      });
    }, 500);
  });
};

export const createMedication = async (data) => {
  // TODO: Implement API call
  console.log('Creating medication:', data);
  return { id: Date.now(), ...data };
};

export const updateMedication = async (id, data) => {
  // TODO: Implement API call
  console.log('Updating medication:', id, data);
  return { id, ...data };
};
