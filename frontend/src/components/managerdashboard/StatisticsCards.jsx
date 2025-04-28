import { Users, Calendar, User2Icon, TrendingUp } from 'lucide-react';
import StatCard from '../dashboard/StatCard';
import { useReports } from '@/hooks/useReports';
import { getAppointmentCompletionData } from '@/utils/getAppointmentCompletion';
import { getAppointmentStatusData } from '@/utils/appointmentStatusData';

import AppointmentCompletion from '@/components/Reports/AppointmentCompletion';
import PatientGrowth from '@/components/Reports/PatientGrowth';
import AppointmentStatus from '@/components/Reports/AppointmentStatus';
import LoadingState from '../LoadingState';
import CustomAlert from '../CustomAlert';
const StatisticsCards = () => {
  const stats = {
    patients: 2537,
    patientGrowth: '12%',
    appointments: 24,
    appointmentGrowth: '8%',
    availableDoctors: 6,
    doctorChangePercent: 2,
    revenue: '$12,450',
    revenueGrowth: '18%',
  };

  const {
    appointmentMetrics,
    isLoadingAppointmentMetrics,
    appointmentMetricsError,
    patientAnalysis,
    isLoadingPatientAnalysis,
    patientAnalysisError,
  } = useReports();
  const appointmentCompletionData = getAppointmentCompletionData(appointmentMetrics);
  const appointmentStatus = getAppointmentStatusData(appointmentMetrics);

  if (isLoadingAppointmentMetrics || isLoadingPatientAnalysis) {
    return <LoadingState fullPage={true} message="Loading Data..." />;
  }

  if (appointmentMetricsError || patientAnalysisError) {
    return <CustomAlert message="Error Loading Data..." />;
  }

  return (
    <div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Total Patients"
          value={stats.patients}
          change={stats.patientGrowth}
          icon={<Users />}
          bgColor="bg-blue-50"
          textColor="text-blue-600"
        />
        <StatCard
          title="Today's Appointments"
          value={stats.appointments}
          change={stats.appointmentGrowth}
          icon={<Calendar />}
          bgColor="bg-indigo-50"
          textColor="text-indigo-600"
        />
        <StatCard
          title="Available Doctors"
          value={stats.availableDoctors}
          change={stats.doctorChangePercent}
          icon={<User2Icon />}
          bgColor="bg-green-50"
          textColor="text-green-600"
        />
        <StatCard
          title="Total Revenue"
          value={stats.revenue}
          change={stats.revenueGrowth}
          icon={<TrendingUp />}
          bgColor="bg-purple-50"
          textColor="text-purple-600"
          isCurrency={true}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AppointmentCompletion
          completionRate={appointmentMetrics.completion.completionRate}
          total={appointmentMetrics.completion.total}
          completed={appointmentMetrics.completion.completed}
          appointmentCompletionData={appointmentCompletionData}
        />

        <PatientGrowth stats={patientAnalysis.patientGrowth} />

        <AppointmentStatus appointmentStatusData={appointmentStatus} />
      </div>
    </div>
  );
};

export default StatisticsCards;
