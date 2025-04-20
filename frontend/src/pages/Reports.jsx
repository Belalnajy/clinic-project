import { Tabs } from '@/components/ui/tabs';
import { useReports } from '@/hooks/useReports';
import TabList from '@/components/Reports/tabs-list/TabList';
import OverviewTab from '@/components/Reports/tabs/OverviewTab';
import AppointmentsTab from '@/components/Reports/tabs/AppointmentsTab';
import PatientTab from '@/components/Reports/tabs/PatientTab';

const Reports = () => {
  const {
    user,
    stats,
    dailyCompletionData,
    appointmentCompletionData,
    appointmentStatusData,
    filters,
    handleFilterChange,
    filteredAppointments,
    uniqueSpecializations,
    uniqueProviders,
    handleExportData,
    patients,
    timeRange,
    setTimeRange,
  } = useReports();

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Reports & Analytics</h1>
        <p className="text-slate-500">View insights and performance metrics for your clinic</p>
      </div>

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
        <Tabs defaultValue="overview" className="w-full">
          {/* ! Tab List component Here */}
          <TabList user={user} timeRange={timeRange} setTimeRange={setTimeRange} />

          {/* Overview */}
          <OverviewTab
            stats={stats}
            appointmentCompletionData={appointmentCompletionData}
            appointmentStatusData={appointmentStatusData}
          />
          {/* Appointments */}
          <AppointmentsTab
            stats={stats}
            dailyCompletionData={dailyCompletionData}
            appointmentCompletionData={appointmentCompletionData}
            appointmentStatusData={appointmentStatusData}
            filters={filters}
            handleFilterChange={handleFilterChange}
            filteredAppointments={filteredAppointments}
            uniqueSpecializations={uniqueSpecializations}
            uniqueProviders={uniqueProviders}
            handleExportData={handleExportData}
            timeRange={timeRange}
            setTimeRange={setTimeRange}
            patients={patients}
          />

          {/* Patients */}
          <PatientTab patients={patients} />
        </Tabs>
      </div>
    </>
  );
};

export default Reports;
