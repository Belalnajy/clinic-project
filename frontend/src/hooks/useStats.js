import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/Auth/useAuth';
import { getAppointments } from '@/api/reports';

const useStats = () => {
  const { user } = useAuth();
  const date = new Date('2025-04-20');

  // Query for all appointments
  const allAppointmentsQuery = useQuery({
    queryKey: ['appointments', 'all', date],
    queryFn: () =>
      getAppointments({
        date,
      }),
    staleTime: 5 * 60 * 1000,
  });

  // Query for in_queue appointments
  const inQueueAppointmentsQuery = useQuery({
    queryKey: ['appointments', 'in_queue', date],
    queryFn: () =>
      getAppointments({
        date,
        status: 'in_queue',
      }),
    staleTime: 5 * 60 * 1000,
  });

  // Calculate stats based on appointments
  const todayCheckIns = allAppointmentsQuery.data?.count || 0;
  const waitingPatients = inQueueAppointmentsQuery.data?.count || 0;

  // Calculate available doctors
  const uniqueDoctors = new Set(
    allAppointmentsQuery.data?.results?.map((app) => app.doctor?.id) || []
  ).size;
  const availableDoctors = Math.max(6 - uniqueDoctors, 0);

  // Calculate new registrations
  const uniquePatients = new Set(
    allAppointmentsQuery.data?.results?.map((app) => app.patient?.id) || []
  ).size;
  const newRegistrations = uniquePatients;

  const stats = {
    todayCheckIns,
    waitingPatients,
    availableDoctors,
    newRegistrations,
  };

  return {
    stats,
    isLoading: allAppointmentsQuery.isLoading || inQueueAppointmentsQuery.isLoading,
    error: allAppointmentsQuery.error || inQueueAppointmentsQuery.error,
  };
};

export default useStats;
