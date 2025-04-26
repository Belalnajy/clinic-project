import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import {
  getAppointmentMetrics,
  getPatientAnalysis,
  getDoctorPerformance,
  getAppointments,
  getDoctors,
  getSpecializations,
} from '@/api/reports';

export const useReports = () => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  const doctor = searchParams.get('doctor') || '';
  const specialization = searchParams.get('specialization') || '';
  const status = searchParams.get('status') || '';

  // Handle date and date range from URL
  const startDateStr = searchParams.get('startDate');
  const endDateStr = searchParams.get('endDate');
  let date = null;
  if (startDateStr && endDateStr) {
    date = {
      startDate: new Date(startDateStr),
      endDate: new Date(endDateStr),
    };
  } else if (searchParams.get('date')) {
    date = new Date(searchParams.get('date'));
  }

  // Fetch appointment metrics
  const {
    data: appointmentMetrics,
    isLoading: isLoadingAppointmentMetrics,
    error: appointmentMetricsError,
  } = useQuery({
    queryKey: ['appointmentMetrics'],
    queryFn: getAppointmentMetrics,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch patient analysis
  const {
    data: patientAnalysis,
    isLoading: isLoadingPatientAnalysis,
    error: patientAnalysisError,
  } = useQuery({
    queryKey: ['patientAnalysis'],
    queryFn: getPatientAnalysis,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch doctors
  const {
    data: doctors,
    isLoading: isLoadingDoctors,
    error: doctorsError,
  } = useQuery({
    queryKey: ['doctors'],
    queryFn: getDoctors,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch specializations
  const {
    data: specializations,
    isLoading: isLoadingSpecializations,
    error: specializationsError,
  } = useQuery({
    queryKey: ['specializations'],
    queryFn: getSpecializations,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const doctorPerformanceQuery = useQuery({
    queryKey: ['doctorPerformance', currentPage],
    queryFn: () => getDoctorPerformance(currentPage),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const appointmentsQuery = useQuery({
    queryKey: ['appointments', currentPage, doctor, specialization, status, date],
    queryFn: () => getAppointments({
      page: currentPage,
      doctor,
      specialization,
      status,
      date
    }),
    keepPreviousData: true, // Keep previous data while loading new data
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
    doctors,
    isLoadingDoctors,
    doctorsError,
    specializations,
    isLoadingSpecializations,
    specializationsError,
  };
};
