import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';

import { Button } from '@/components/ui/button';
import AppointmentCompletion from '@/components/Reports/AppointmentCompletion';
import AppointmentStatus from '@/components/Reports/AppointmentStatus';

import DailyCompletionChart from '@/components/Reports/DailyCompletionChart';
import AppointmentTable from '@/components/Reports/AppointmentTable';
import TableFilters from '@/components/Reports/TableFilters';
import PatientDemographics from '../components/Reports/PatientDemographics';
import { FileArchive } from 'lucide-react';
import { useReports } from '@/hooks/useReports';
import TabList from '@/components/Reports/tabs-list/TabList';
import OverviewTab from '@/components/Reports/tabs/OverviewTab';

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

          <TabsContent value="appointments" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Appointment Analytics</CardTitle>
                <CardDescription>Detailed analysis of appointment data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <AppointmentStatus appointmentStatusData={appointmentStatusData} />

                  <DailyCompletionChart dailyCompletionData={dailyCompletionData} />

                  <AppointmentCompletion
                    completionRate={stats.appointmentStats.completionRate}
                    total={stats.appointmentStats.total}
                    completed={stats.appointmentStats.completed}
                    appointmentCompletionData={appointmentCompletionData}
                  />
                </div>

                <TableFilters
                  filters={filters}
                  handleFilterChange={handleFilterChange}
                  uniqueSpecializations={uniqueSpecializations}
                  uniqueProviders={uniqueProviders}
                />

                <div className="overflow-x-auto">
                  <AppointmentTable appointments={filteredAppointments} />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4 md:flex-row md:justify-end">
                <Button
                  size="lg"
                  className="border-slate-200 bg-secondary text-slate-800 hover:bg-slate-200  hover:cursor-pointer"
                  onClick={handleExportData}
                >
                  <FileArchive size={16} className="mr-2 text-slate-800" />
                  Export
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="patients" className="mt-6">
            <PatientDemographics patients={patients} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Reports;
