import { useSearchParams } from 'react-router-dom';
import { useReports } from '@/hooks/useReports';
import { Tabs } from '@/components/ui/tabs';
import TabList from '@/components/Reports/tabs-list/TabList';
import OverviewTab from '@/components/Reports/tabs/OverviewTab';
import LoadingState from '@/components/LoadingState';

const Reports = () => {
  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const {
    appointmentMetrics,
    isLoadingAppointmentMetrics,
    patientAnalysis,
    isLoadingPatientAnalysis,
    doctorPerformanceData,
    isLoadingDoctorPerformance,
    appointmentsData,
    isLoadingAppointments,
  } = useReports();

  if (
    isLoadingAppointmentMetrics ||
    isLoadingPatientAnalysis ||
    isLoadingDoctorPerformance ||
    isLoadingAppointments
  ) {
    return <LoadingState fullPage={true} message="Loading reports and analytics..." />;
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Reports & Analytics</h1>
        <p className="text-slate-500">View insights and performance metrics for your clinic</p>
      </div>

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
        <Tabs defaultValue="overview" className="w-full">
          <TabList user={{ role: 'manager' }} />
          <OverviewTab appointmentMetrics={appointmentMetrics} patientAnalysis={patientAnalysis} />
        </Tabs>
      </div>
    </>
  );
};

export default Reports;
