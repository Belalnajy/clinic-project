import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import {
  getAppointmentMetrics,
  getPatientAnalysis,
  getDoctorPerformance,
  getAppointments,
  getDoctors,
  getSpecializations,
  getFinancialMetrics,
} from '@/api/reports';

export const useReports = () => {
  const [searchParams] = useSearchParams();
  // Filters from URL
  const currentPage = Number(searchParams.get('page')) || 1;
  const doctorPage = Number(searchParams.get('doctorPage')) || 1;
  const doctor = searchParams.get('doctor') || '';
  const specialization = searchParams.get('specialization') || '';
  const status = searchParams.get('status') || '';

  // Date filter
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

  // Queries
  const appointmentMetricsQuery = useQuery({
    queryKey: ['appointmentMetrics'],
    queryFn: getAppointmentMetrics,
    staleTime: 5 * 60 * 1000,
  });

  const financialMetricsQuery = useQuery({
    queryKey: ['financialMetrics'],
    queryFn: getFinancialMetrics,
    staleTime: 5 * 60 * 1000,
  });

  const patientAnalysisQuery = useQuery({
    queryKey: ['patientAnalysis'],
    queryFn: getPatientAnalysis,
    staleTime: 5 * 60 * 1000,
  });

  const doctorsQuery = useQuery({
    queryKey: ['doctors'],
    queryFn: getDoctors,
    staleTime: 5 * 60 * 1000,
  });

  const specializationsQuery = useQuery({
    queryKey: ['specializations'],
    queryFn: getSpecializations,
    staleTime: 5 * 60 * 1000,
  });

  const doctorPerformanceQuery = useQuery({
    queryKey: ['doctorPerformance', doctorPage],
    queryFn: () => getDoctorPerformance(doctorPage),
    staleTime: 5 * 60 * 1000,
  });

  const appointmentsQuery = useQuery({
    queryKey: ['appointments', currentPage, doctor, specialization, status, date],
    queryFn: () => getAppointments({
      page: currentPage,
      doctor,
      specialization,
      status,
      date,
    }),
    keepPreviousData: true,
  });

  return {
    // Appointment metrics
    appointmentMetrics: appointmentMetricsQuery.data,
    isLoadingAppointmentMetrics: appointmentMetricsQuery.isLoading,
    appointmentMetricsError: appointmentMetricsQuery.error,
    // Financial metrics
    financialMetrics: financialMetricsQuery.data,
    isLoadingFinancialMetrics: financialMetricsQuery.isLoading,
    financialMetricsError: financialMetricsQuery.error,
    // Patient analysis
    patientAnalysis: patientAnalysisQuery.data,
    isLoadingPatientAnalysis: patientAnalysisQuery.isLoading,
    patientAnalysisError: patientAnalysisQuery.error,
    // Doctor performance
    doctorPerformanceData: doctorPerformanceQuery.data,
    isLoadingDoctorPerformance: doctorPerformanceQuery.isLoading,
    doctorPerformanceError: doctorPerformanceQuery.error,
    // Appointments
    appointmentsData: appointmentsQuery.data,
    isLoadingAppointments: appointmentsQuery.isLoading,
    appointmentsError: appointmentsQuery.error,
    // Doctors and specializations
    doctors: doctorsQuery.data,
    isLoadingDoctors: doctorsQuery.isLoading,
    doctorsError: doctorsQuery.error,
    specializations: specializationsQuery.data,
    isLoadingSpecializations: specializationsQuery.isLoading,
    specializationsError: specializationsQuery.error,
  };
};
