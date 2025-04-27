import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/Auth/useAuth';
import { getAppointments } from '@/api/reports';

const useStats = () => {
  const { user } = useAuth();
  const testDate = '2025-4-20';

  // Query for all appointments
  const allAppointmentsQuery = useQuery({
    queryKey: ['appointments', 'all', testDate],
    queryFn: () =>
      getAppointments({
        appointment_date: testDate,
      }),
    staleTime: 5 * 60 * 1000,
  });

  // Query for in_queue appointments
  const inQueueAppointmentsQuery = useQuery({
    queryKey: ['appointments', 'in_queue', testDate],
    queryFn: () =>
      getAppointments({
        appointment_date: testDate,
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
