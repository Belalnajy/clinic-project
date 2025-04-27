import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPatientLabResults, addLabResult } from '@/api/labResults';
import { useSearchParams } from 'react-router-dom';

/**
 * Hook to fetch lab results for a patient
 * @param {number} patientId - ID of the patient
 * @returns {Object} - Query result containing lab results data and status
 */
export const usePatientLabResults = (patientId) => {
  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const {
    data: labData,
    isLoading: labResultsLoading,
    error: labResultsError,
  } = useQuery({
    queryKey: ['labResults', patientId],
    queryFn: () => getPatientLabResults(patientId),
    enabled: !!patientId,
  });

  return {
    labResults: labData?.results || [],
    pagination: {
      count: labData?.count || 0,
      next: labData?.next,
      previous: labData?.previous,
      currentPage,
    },
    labResultsLoading,
    labResultsError,
  };
};

/**
 * Hook to add a new lab result
 * @returns {Object} - Mutation object for adding lab results
 */
export const useAddLabResult = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addLabResult,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['labResults'],
      });
    },
  });
};
