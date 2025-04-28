import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios'; // Adjust the path to your axios instance
import { useSearchParams } from 'react-router-dom';
import {
  getAppointment,
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  cancelAppointment,
  completeAppointment,
} from '@/api/appointments';
import { Pagination } from '@/components/ui/pagination';

const useAppointments = () => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  const search = searchParams.get('search') || '';

  // Fetch appointments using useQuery
  const {
    data: appointmentsData,
    isLoading: isLoadingAppointments,
    error: appointmentsError,
  } = useQuery({
    queryKey: ['appointments', currentPage, search],
    queryFn: () => getAppointments({ page: currentPage, search }),
  });

  // Fetch a single appointment using useQuery
  const useAppointment = (id) => {
    return useQuery({
      queryKey: ['appointment', id],
      queryFn: () => getAppointment(id),
      enabled: !!id, // Only fetch if id is provided
    });
  };

  // Create appointment using useMutation
  const createAppointmentMutation = useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });

  // Update appointment using useMutation
  const updateAppointmentMutation = useMutation({
    mutationFn: ({ id, data }) => updateAppointment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });

  // Delete appointment using useMutation
  const deleteAppointmentMutation = useMutation({
    mutationFn: (id) => deleteAppointment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });

  // Cancel appointment using useMutation
  const cancelAppointmentMutation = useMutation({
    mutationFn: (id) => cancelAppointment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });

  // Complete appointment using useMutation
  const completeAppointmentMutation = useMutation({
    mutationFn: (id) => completeAppointment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });

  return {
    appointments: appointmentsData?.results || [],
    pagination: {
      count: appointmentsData?.count || 0,
      next: appointmentsData?.next,
      previous: appointmentsData?.previous,
      currentPage,
    },
    isLoadingAppointments,
    appointmentsError,
    useAppointment,
    createAppointment: createAppointmentMutation.mutateAsync,
    updateAppointment: updateAppointmentMutation.mutateAsync,
    deleteAppointment: deleteAppointmentMutation.mutateAsync,
    cancelAppointment: cancelAppointmentMutation.mutateAsync,
    completeAppointment: completeAppointmentMutation.mutateAsync,
    isCreating: createAppointmentMutation.isPending,
    isUpdating: updateAppointmentMutation.isPending,
    isDeleting: deleteAppointmentMutation.isPending,
    isCancelling: cancelAppointmentMutation.isPending,
    isCompleting: completeAppointmentMutation.isPending,
  };
};

export default useAppointments;
