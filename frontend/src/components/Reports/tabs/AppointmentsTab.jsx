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
import AppointmentAnalyticsHeader from '../AppointmentAnalyticsHeader';
import AppointmentTable from '@/components/Reports/AppointmentTable';
import TableFilters from '@/components/Reports/TableFilters';
import ExportAppointmentsButton from '../ExportAppointmentsButton';
import LoadingState from '@/components/LoadingState';
import useAppointmentFilters from '../../../hooks/useAppointmentFilters';
import { useReports } from '@/hooks/useReports';

const AppointmentsTab = () => {
  const { filters, handleFilterChange } = useAppointmentFilters();

  const { appointmentMetrics, appointmentsData, isLoadingAppointments, doctors, specializations } =
    useReports();

  return (
    <TabsContent value="appointments" className="mt-6">
      <Card>
        <CardHeader>
          <CardTitle>Appointment Analytics</CardTitle>
          <CardDescription>Detailed analysis of appointment data</CardDescription>
        </CardHeader>
        <CardContent>
          <AppointmentAnalyticsHeader appointmentMetrics={appointmentMetrics} />
          <TableFilters
            filters={filters}
            handleFilterChange={handleFilterChange}
            doctors={doctors}
            specializations={specializations}
          />
          <div className="overflow-x-auto">
            {isLoadingAppointments ? (
              <div className="flex justify-center items-center h-[500px]">
                <LoadingState message="Loading appointments..." className="scale-250" />
              </div>
            ) : (
              <AppointmentTable appointments={appointmentsData} />
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 md:flex-row md:justify-end">
          <ExportAppointmentsButton appointmentsData={appointmentsData} />
        </CardFooter>
      </Card>
    </TabsContent>
  );
};

export default AppointmentsTab;
