import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/Auth/useAuth';
import { getAppointments, getPatientAnalysis, getAvailableDoctorsCount } from '@/api/reports';

const useStats = () => {
  const { user } = useAuth();
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
  const day = String(date.getDate()).padStart(2, '0');
  const _today = `${year}-${month}-${day}`;
  const today = new Date(_today);
  // Query for all appointments
  const allAppointmentsQuery = useQuery({
    queryKey: ['appointments', 'all', today],
    queryFn: () =>
      getAppointments({
        date: today,
      }),
    staleTime: 5 * 60 * 1000,
  });

  // Query for in_queue appointments
  const inQueueAppointmentsQuery = useQuery({
    queryKey: ['appointments', 'in_queue', today],
    queryFn: () =>
      getAppointments({
        date: today,
        status: 'in_queue',
      }),
    staleTime: 5 * 60 * 1000,
  });

  // Query for available doctors count
  const availableDoctorsQuery = useQuery({
    queryKey: ['availableDoctors'],
    queryFn: getAvailableDoctorsCount,
    staleTime: 5 * 60 * 1000,
  });

  const patientAnalysisQuery = useQuery({
    queryKey: ['patientAnalysis'],
    queryFn: getPatientAnalysis,
    staleTime: 5 * 60 * 1000,
  });
  // Calculate stats based on appointments
  const todayCheckIns = allAppointmentsQuery.data?.count;
  const waitingPatients = inQueueAppointmentsQuery.data?.count;
  const availableDoctors = availableDoctorsQuery.data?.count;
  const newRegistrations = patientAnalysisQuery.data?.patientGrowth.new;

  const stats = {
    todayCheckIns,
    waitingPatients,
    availableDoctors,
    newRegistrations,
  };

  return {
    stats,
    isLoading:allAppointmentsQuery.isLoading || inQueueAppointmentsQuery.isLoading || availableDoctorsQuery.isLoading || patientAnalysisQuery.isLoading,
    error:allAppointmentsQuery.error || inQueueAppointmentsQuery.error || availableDoctorsQuery.error || patientAnalysisQuery.error,
  };
};

export default useStats;
