import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDoctors, getSpecializations, toggleDoctorStatus } from '@/api/doctors';
import { toast } from 'sonner';

export const useDoctors = () => {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const queryClient = useQueryClient();

  // Fetch doctors
  const { data: doctorsData = { results: [], count: 0 }, isLoading } = useQuery({
    queryKey: ['doctors', query, page, pageSize],
    queryFn: () => getDoctors(query, page, pageSize),
    initialData: { results: [], count: 0 },
  });

  // Calculate pagination values
  const totalPages = Math.ceil(doctorsData.count / pageSize);
  const canPreviousPage = page > 1;
  const canNextPage = page < totalPages;

  // Pagination handlers
  const previousPage = () => setPage((old) => Math.max(old - 1, 1));
  const nextPage = () => setPage((old) => Math.min(old + 1, totalPages));
  const goToPage = (pageNumber) => setPage(pageNumber);

  // Fetch specializations
  const { data: specializations = [] } = useQuery({
    queryKey: ['specializations'],
    queryFn: getSpecializations,
  });

  // Toggle doctor status mutation
  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, isActive }) => toggleDoctorStatus(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      toast.success('Doctor status updated successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update doctor status');
    },
  });

  return {
    doctors: doctorsData.results || [],
    totalDoctors: doctorsData.count || 0,
    specializations,
    isLoading,
    query,
    setQuery,
    page,
    pageSize,
    setPageSize,
    totalPages,
    canPreviousPage,
    canNextPage,
    previousPage,
    nextPage,
    goToPage,
    toggleDoctorStatus: toggleStatusMutation.mutate,
  };
};
