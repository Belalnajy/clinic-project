import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import {
  getAppointment,
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  cancelAppointment,
  completeAppointment,
  getTodayAppointments,
  markAppointmentAsQueue,
} from '@/api/appointments';
import { getDashboardStatistics } from '@/api/statistics';

const useAppointments = () => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  const currentPage = Number(searchParams.get('page')) || 1;
  const startDate = searchParams.get('date') || searchParams.get('startDate') || '';
  const endDate = searchParams.get('endDate') || '';
  const search = searchParams.get('search') || '';

  // Fetch appointments using useQuery
  const {
    data: appointmentsData,
    isLoading: isLoadingAppointments,
    error: appointmentsError,
  } = useQuery({
    queryKey: ['app', 'appointments', currentPage, search, startDate, endDate],
    queryFn: () => getAppointments({ page: currentPage, search, startDate, endDate }),
  });

  // Fetch today's appointments
  const {
    data: todayAppointmentsData,
    isLoading: isLoadingTodayAppointments,
    error: todayAppointmentsError,
  } = useQuery({
    queryKey: ['app', 'todayAppointments', currentPage],
    queryFn: () => getTodayAppointments(currentPage),
  });

  // Fetch dashboard statistics
  const {
    data: dashboardStats,
    isLoading: isLoadingStats,
    error: statsError,
  } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: getDashboardStatistics,
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
      queryClient.invalidateQueries({ queryKey: ['app'] });
    },
  });

  // Update appointment using useMutation
  const updateAppointmentMutation = useMutation({
    mutationFn: ({ id, data }) => updateAppointment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['app'] });
    },
  });

  // Delete appointment using useMutation
  const deleteAppointmentMutation = useMutation({
    mutationFn: (id) => deleteAppointment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['app'] });
    },
  });

  // Cancel appointment using useMutation
  const cancelAppointmentMutation = useMutation({
    mutationFn: (id) => cancelAppointment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['app'],
      });
    },
  });

  // Complete appointment using useMutation
  const completeAppointmentMutation = useMutation({
    mutationFn: (id) => completeAppointment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['app'] });
    },
  });
  // Complete appointment using useMutation
  const queueAppointmentMutation = useMutation({
    mutationFn: (id) => markAppointmentAsQueue(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['app'] });
    },
  });

  return {
    // Appointments data
    appointments: appointmentsData?.results || [],
    todayAppointments: todayAppointmentsData?.results || [],
    dashboardStats: dashboardStats || {},

    // Pagination
    pagination: {
      count: appointmentsData?.count || 0,
      next: appointmentsData?.next,
      previous: appointmentsData?.previous,
      currentPage,
    },
    todayAppointmentsPagination: {
      count: todayAppointmentsData?.count || 0,
      next: todayAppointmentsData?.next,
      previous: todayAppointmentsData?.previous,
      currentPage,
    },

    useAppointment,

    // Loading states
    isLoadingAppointments,
    isLoadingTodayAppointments,
    isLoadingStats,

    // Error states
    appointmentsError,
    todayAppointmentsError,
    statsError,

    // Mutations
    createAppointment: createAppointmentMutation.mutateAsync,
    updateAppointment: updateAppointmentMutation.mutateAsync,
    deleteAppointment: deleteAppointmentMutation.mutateAsync,
    cancelAppointment: cancelAppointmentMutation.mutateAsync,
    completeAppointment: completeAppointmentMutation.mutateAsync,
    queueAppointment: queueAppointmentMutation.mutateAsync,
    // Mutation states
    isCreating: createAppointmentMutation.isPending,
    isUpdating: updateAppointmentMutation.isPending,
    isDeleting: deleteAppointmentMutation.isPending,
    isCancelling: cancelAppointmentMutation.isPending,
    isCompleting: completeAppointmentMutation.isPending,
    isQueueing: queueAppointmentMutation.isPending,
  };
};

export default useAppointments;
