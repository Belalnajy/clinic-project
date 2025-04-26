import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, useSearchParams } from 'react-router-dom';
import {
  getPatientPrescriptions,
  createPrescription,
  addMedicationsToPrescription,
} from '@/api/prescriptions';
import { toast } from 'sonner';

export const usePrescriptions = () => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  const { id: patientId } = useParams();
  // Query for patient's prescriptions with pagination
  const {
    data: prescriptionsData,
    isLoading: isLoadingPrescriptions,
    error: prescriptionsError,
  } = useQuery({
    queryKey: ['prescriptions', patientId, currentPage],
    queryFn: () => getPatientPrescriptions(currentPage, patientId),
    enabled: !!patientId,
  });

  // Mutation for creating a new prescription
  const createPrescriptionMutation = useMutation({
    mutationFn: createPrescription,
    onSuccess: () => {
      queryClient.invalidateQueries(['prescriptions', patientId]);
      toast.success('Prescription created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create prescription', {
        description: error.message,
      });
    },
  });

  // Mutation for adding medications
  const addMedicationsMutation = useMutation({
    mutationFn: addMedicationsToPrescription,
    onSuccess: () => {
      queryClient.invalidateQueries(['prescriptions', patientId]);
      toast.success('Medications added successfully');
    },
    onError: (error) => {
      toast.error('Failed to add medications', {
        description: error.message,
      });
    },
  });

  return {
    prescriptionsData: prescriptionsData?.results || [],
    isLoadingPrescriptions,
    prescriptionsError,
    pagination: {
      count: prescriptionsData?.count || 0,
      next: prescriptionsData?.next,
      previous: prescriptionsData?.previous,
      currentPage,
    },
    createPrescription: createPrescriptionMutation.mutate,
    addMedications: addMedicationsMutation.mutate,
    isCreatingPrescription: createPrescriptionMutation.isPending,
    isAddingMedications: addMedicationsMutation.isPending,
  };
};
