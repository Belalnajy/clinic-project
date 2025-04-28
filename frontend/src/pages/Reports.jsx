import { useSearchParams } from 'react-router-dom';
import { useReports } from '@/hooks/useReports';
import { Tabs } from '@/components/ui/tabs';
import TabList from '@/components/Reports/tabs-list/TabList';
import OverviewTab from '@/components/Reports/tabs/OverviewTab';
import AppointmentsTab from '@/components/Reports/tabs/AppointmentsTab';
import PatientTab from '@/components/Reports/tabs/PatientTab';
import DoctorsTab from '@/components/Reports/tabs/DoctorsTab';

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
    doctors,
    isLoadingDoctors,
    specializations,
    isLoadingSpecializations,
  } = useReports();

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Reports & Analytics</h1>
        <p className="text-slate-500">View insights and performance metrics for your clinic</p>
      </div>

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
        <Tabs defaultValue="overview" className="w-full">
          <TabList />
          {/* Overview Tab */}
          <OverviewTab
            appointmentMetrics={appointmentMetrics}
            patientAnalysis={patientAnalysis}
            isLoading={isLoadingAppointmentMetrics || isLoadingPatientAnalysis}
          />
          {/* Appointments Tab */}
          <AppointmentsTab
            appointmentMetrics={appointmentMetrics}
            appointmentsData={appointmentsData}
            isLoadingAppointments={isLoadingAppointments}
            doctors={doctors}
            specializations={specializations}
            isLoading={isLoadingDoctors || isLoadingSpecializations}
          />
          {/* Patient Tab */}
          <PatientTab />
          {/* Doctors Tab */}
          <DoctorsTab />
        </Tabs>
      </div>
    </>
  );
};

export default Reports;
