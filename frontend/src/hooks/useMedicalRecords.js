import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import {
  getMedicalRecords,
  getMedicalRecord,
  getLatestMedicalRecord,
  createMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord,
} from '@/api/medicalRecords';

export const useMedicalRecords = (patientId) => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  // Get all medical records with pagination
  const {
    data: medicalRecordsData,
    isLoading: isLoadingMedicalRecords,
    error: medicalRecordsError,
  } = useQuery({
    queryKey: ['medicalRecords', currentPage, patientId],
    queryFn: () => getMedicalRecords(currentPage, patientId),
  });

  // Get single medical record
  const useMedicalRecord = (id) => {
    return useQuery({
      queryKey: ['medicalRecord', id],
      queryFn: () => getMedicalRecord(id),
      enabled: !!id,
    });
  };

  // Get latest medical record
  const useLatestMedicalRecord = (patientId) => {
    return useQuery({
      queryKey: ['medicalRecord', 'latest', patientId],
      queryFn: () => getLatestMedicalRecord(patientId),
      enabled: !!patientId,
    });
  };

  // Create medical record mutation
  const createMedicalRecordMutation = useMutation({
    mutationFn: createMedicalRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicalRecords'] });
      queryClient.invalidateQueries({ queryKey: ['medicalRecord', 'latest'] });
    },
  });

  // Update medical record mutation
  const updateMedicalRecordMutation = useMutation({
    mutationFn: ({ id, data }) => updateMedicalRecord(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicalRecords'] });
      queryClient.invalidateQueries({ queryKey: ['medicalRecord', 'latest'] });
    },
  });

  // Delete medical record mutation
  const deleteMedicalRecordMutation = useMutation({
    mutationFn: deleteMedicalRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicalRecords'] });
      queryClient.invalidateQueries({ queryKey: ['medicalRecord', 'latest'] });
    },
  });

  return {
    medicalRecords: medicalRecordsData?.results || [],
    pagination: {
      count: medicalRecordsData?.count || 0,
      next: medicalRecordsData?.next,
      previous: medicalRecordsData?.previous,
      currentPage,
    },
    isLoadingMedicalRecords,
    medicalRecordsError,
    useMedicalRecord,
    useLatestMedicalRecord,
    createMedicalRecord: createMedicalRecordMutation.mutateAsync,
    updateMedicalRecord: updateMedicalRecordMutation.mutateAsync,
    deleteMedicalRecord: deleteMedicalRecordMutation.mutateAsync,
    isCreating: createMedicalRecordMutation.isPending,
    isUpdating: updateMedicalRecordMutation.isPending,
    isDeleting: deleteMedicalRecordMutation.isPending,
  };
};
