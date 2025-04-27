import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getPatients,
  getPatient,
  createPatient,
  updatePatient,
  deletePatient,
  reActivatePatient,
} from '@/api/patients';
import { useParams, useSearchParams } from 'react-router-dom';

// Fetch all patients with pagination and search
export const usePatientsList = (is_active = true) => {
  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  const search = searchParams.get('search') || '';

  const { data, isLoading, error } = useQuery({
    queryKey: ['patients', currentPage, search, is_active],
    queryFn: () => getPatients({ page: currentPage, search, is_active }),
  });

  return {
    patientsData: data?.results || [],
    patientsLoading: isLoading,
    patientsError: error,
    pagination: {
      count: data?.count || 0,
      currentPage,
    },
  };
};

export const usePatient = () => {
  const { id: patientId } = useParams();
  return useQuery({
    queryKey: ['patient', patientId],
    queryFn: () => getPatient(patientId),
    enabled: !!patientId,
  });
};

// Create Patient
export const useAddPatientMutation = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createPatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
    onError: (error) => {
      console.error('Error creating patient:', error);
      throw error;
    },
  });
  return { createPatient: mutation.mutateAsync, isCreating: mutation.isPending };
};

// Update Patient
export const useUpdatePatientMutation = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ id, ...data }) => updatePatient(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.invalidateQueries({ queryKey: ['patient'] });
    },
    onError: (error) => {
      console.error('Error updating patient:', error);
      throw error;
    },
  });
  return { updatePatient: mutation.mutateAsync, isUpdating: mutation.isPending };
};

// Delete patient mutation
export const useDeletePatientMutation = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deletePatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
    onError: (error) => {
      console.error('Error deleting patient:', error);
      throw error;
    },
  });
  return { deletePatient: mutation.mutateAsync, isDeleting: mutation.isPending };
};

// Reactivate patient mutation
export const useReactivatePatientMutation = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: reActivatePatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
    onError: (error) => {
      console.error('Error reactivating patient:', error);
      throw error;
    },
  });
  return { reactivatePatient: mutation.mutateAsync, isReactivating: mutation.isPending };
};
