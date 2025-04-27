import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getPatients,
  getPatient,
  savePatient,
  deletePatient,
  getDeactivatedPatients,
  togglePatientStatus,
  activatePatient,
} from '@/api/patients';

export const usePatients = () => {
  const queryClient = useQueryClient();

  // Fetch all patients with pagination and search
  const usePatientsList = (page = 1, search = '') => {
    return useQuery({
      queryKey: ['patients', page, search],
      queryFn: () => getPatients(page, search),
      keepPreviousData: true,
    });
  };

  // Fetch deactivated patients
  const useDeactivatedPatients = () => {
    return useQuery({
      queryKey: ['deactivatedPatients'],
      queryFn: getDeactivatedPatients,
    });
  };

  // Save patient (create or update)
  const savePatientMutation = useMutation({
    mutationFn: ({ data, id }) => savePatient(data, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });

  // Delete patient mutation
  const deletePatientMutation = useMutation({
    mutationFn: (id) => deletePatient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });

  // Toggle patient active status
  const togglePatientStatusMutation = useMutation({
    mutationFn: ({ id, isActive }) => togglePatientStatus(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });

  // Activate a deactivated patient
  const activatePatientMutation = useMutation({
    mutationFn: (id) => activatePatient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });

  return {
    usePatientsList,
    useDeactivatedPatients, // Expose the new query
    savePatient: savePatientMutation.mutateAsync,
    isSavingPatient: savePatientMutation.isLoading,
    deletePatient: deletePatientMutation.mutateAsync,
    isDeletingPatient: deletePatientMutation.isLoading,
    togglePatientStatus: togglePatientStatusMutation.mutateAsync,
    isTogglingPatientStatus: togglePatientStatusMutation.isLoading,
    activatePatient: activatePatientMutation.mutateAsync,
    isActivatingPatient: activatePatientMutation.isLoading,
  };
};
