import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import {
  getMedications,
  getMedication,
  createMedication,
  updateMedication,
  deleteMedication,
} from '@/api/medications';

export const useMedications = () => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  // Get all medications with pagination
  const {
    data: medicationsData,
    isLoading: isLoadingMedications,
    error: medicationsError,
  } = useQuery({
    queryKey: ['medications', currentPage],
    queryFn: () => getMedications(currentPage),
  });

  // Get single medication
  const useMedication = (id) => {
    return useQuery({
      queryKey: ['medication', id],
      queryFn: () => getMedication(id),
      enabled: !!id,
    });
  };

  // Create medication mutation
  const createMedicationMutation = useMutation({
    mutationFn: createMedication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications'] });
    },
  });

  // Update medication mutation
  const updateMedicationMutation = useMutation({
    mutationFn: ({ id, data }) => updateMedication(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications'] });
    },
  });

  // Delete medication mutation
  const deleteMedicationMutation = useMutation({
    mutationFn: deleteMedication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications'] });
    },
  });

  return {
    medications: medicationsData?.results || [],
    pagination: {
      count: medicationsData?.count || 0,
      next: medicationsData?.next,
      previous: medicationsData?.previous,
      currentPage,
    },
    isLoadingMedications,
    medicationsError,
    useMedication,
    createMedication: createMedicationMutation.mutateAsync,
    updateMedication: updateMedicationMutation.mutateAsync,
    deleteMedication: deleteMedicationMutation.mutateAsync,
    isCreating: createMedicationMutation.isPending,
    isUpdating: updateMedicationMutation.isPending,
    isDeleting: deleteMedicationMutation.isPending,
  };
};
