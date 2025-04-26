import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import {
  getPatientPrescriptions,
  createPrescription,
  addMedicationsToPrescription,
} from '@/api/prescriptions';
export const usePrescriptions = () => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  const patientId = searchParams.get('patient_id');
  // Get all medications with pagination
  const {
    data: prescriptionsData,
    isLoading: isLoadingPrescriptions,
    error: prescriptionsError,
  } = useQuery({
    queryKey: ['prescriptions', currentPage],
    queryFn: () => getPatientPrescriptions(currentPage, patientId),
  });

  // Create medication mutation
  const createPrescriptionMutation = useMutation({
    mutationFn: createPrescription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prescriptions'] });
    },
  });

  // Update medication mutation
  const addMedicationsToPrescriptionMutation = useMutation({
    mutationFn: addMedicationsToPrescription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prescriptions'] });
    },
  });

  return {
    medications: prescriptionsData?.results || [],
    pagination: {
      count: prescriptionsData?.count || 0,
      next: prescriptionsData?.next,
      previous: prescriptionsData?.previous,
      currentPage,
    },
    isLoadingPrescriptions,
    prescriptionsError,
    createPrescription: createPrescriptionMutation.mutateAsync,
    addMedicationsToPrescription: addMedicationsToPrescriptionMutation.mutateAsync,
    isCreatingPrescription: createPrescriptionMutation.isPending,
    isAddingMedications: addMedicationsToPrescriptionMutation.isPending,
  };
};
