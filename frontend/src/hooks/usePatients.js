import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getPatients,
  getPatient,
  savePatient,
  deletePatient,
  getDeactivatedPatients,
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

  return {
    usePatientsList,
    useDeactivatedPatients, // Expose the new query
    savePatient: savePatientMutation.mutateAsync,
    isSavingPatient: savePatientMutation.isLoading,
    deletePatient: deletePatientMutation.mutateAsync,
    isDeletingPatient: deletePatientMutation.isLoading,
  };
};
