import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import AppointmentCompletion from '@/components/Reports/AppointmentCompletion';
import AppointmentStatus from '@/components/Reports/AppointmentStatus';

import DailyCompletionChart from '@/components/Reports/DailyCompletionChart';
import AppointmentTable from '@/components/Reports/AppointmentTable';
import TableFilters from '@/components/Reports/TableFilters';
import { FileArchive } from 'lucide-react';

const AppointmentsTab = (props) => {
  const {
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
  } = props;
  return (
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
  );
};

export default AppointmentsTab;
