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
  console.log(data);
  return {
    patientsData: data?.results || [],
    patientsLoading: isLoading,
    patientsError: error,
    pagination: {
      count: 40,
      currentPage,
    },
  };
};

export const usePatient = () => {
  const { id: patientId } = useParams();
  return useQuery({
    queryKey: ['patient'],
    queryFn: () => getPatient(patientId),
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
  });
  return { createPatient: mutation.mutateAsync, isCreating: mutation.isPending };
};
// Update Patient
export const useUpdatePatientMutation = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: updatePatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });
  return { UpdatePatient: mutation.mutateAsync, isUpdating: mutation.isPending };
};

// Delete patient mutation
export const useDeletePatientMutation = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deletePatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
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
  });
  return { reactivatePatient: mutation.mutateAsync, isReactivating: mutation.isPending };
};
