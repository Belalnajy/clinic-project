import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import {
  getAppointmentMetrics,
  getPatientAnalysis,
  getDoctorPerformance,
  getAppointments,
} from '@/api/reports';

export const useReports = () => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  // Fetch appointment metrics
  const {
    data: appointmentMetrics,
    isLoading: isLoadingAppointmentMetrics,
    error: appointmentMetricsError,
  } = useQuery({
    queryKey: ['appointmentMetrics'],
    queryFn: getAppointmentMetrics,
  });

  // Fetch patient analysis
  const {
    data: patientAnalysis,
    isLoading: isLoadingPatientAnalysis,
    error: patientAnalysisError,
  } = useQuery({
    queryKey: ['patientAnalysis'],
    queryFn: getPatientAnalysis,
  });

  const doctorPerformanceQuery = useQuery({
    queryKey: ['doctorPerformance', currentPage],
    queryFn: () => getDoctorPerformance(currentPage),
  });

  const appointmentsQuery = useQuery({
    queryKey: ['appointments', currentPage],
    queryFn: () => getAppointments(currentPage),
  });

  return {
    appointmentMetrics,
    isLoadingAppointmentMetrics,
    appointmentMetricsError,
    patientAnalysis,
    isLoadingPatientAnalysis,
    patientAnalysisError,
    doctorPerformanceData: doctorPerformanceQuery.data,
    isLoadingDoctorPerformance: doctorPerformanceQuery.isLoading,
    doctorPerformanceError: doctorPerformanceQuery.error,
    appointmentsData: appointmentsQuery.data,
    isLoadingAppointments: appointmentsQuery.isLoading,
    appointmentsError: appointmentsQuery.error,
  };
};
