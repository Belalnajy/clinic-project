import React, { useState } from 'react';
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
import { getAppointmentStatusData } from '@/utils/appointmentStatusData';
import { getAppointmentCompletionData } from '@/utils/getAppointmentCompletion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import LoadingState from '@/components/LoadingState';

const AppointmentsTab = (props) => {
  const { appointmentMetrics, appointmentsData, isLoadingAppointments, doctors, specializations } =
    props;
  console.log('doctors', doctors);
  console.log('specializations', specializations);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    doctor: searchParams.get('doctor') || '',
    status: searchParams.get('status') || '',
    date_filter: searchParams.get('date_filter') || '',
  });

  const appointmentStatus = appointmentMetrics ? getAppointmentStatusData(appointmentMetrics) : [];
  const appointmentCompletionData = appointmentMetrics
    ? getAppointmentCompletionData(appointmentMetrics)
    : [];

  const handleFilterChange = (filterName, value) => {
    const newFilters = { ...filters, [filterName]: value };
    setFilters(newFilters);

    // Update URL search params
    const newSearchParams = new URLSearchParams(searchParams);
    if (value) {
      newSearchParams.set(filterName, value);
    } else {
      newSearchParams.delete(filterName);
    }
    // Reset to page 1 when filters change
    newSearchParams.set('page', '1');
    setSearchParams(newSearchParams);
  };

  const handleExportData = () => {
    // TODO: Implement export functionality
    console.log('Export data');
  };

  return (
    <TabsContent value="appointments" className="mt-6">
      <Card>
        <CardHeader>
          <CardTitle>Appointment Analytics</CardTitle>
          <CardDescription>Detailed analysis of appointment data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AppointmentStatus appointmentStatusData={appointmentStatus} />
            {appointmentMetrics && (
              <>
                <DailyCompletionChart dailyCompletionData={appointmentMetrics.dailyCompletion} />
                <AppointmentCompletion
                  completionRate={appointmentMetrics.completion.completionRate}
                  total={appointmentMetrics.completion.total}
                  completed={appointmentMetrics.completed}
                  appointmentCompletionData={appointmentCompletionData}
                />
              </>
            )}
          </div>

          {/* <TableFilters
            filters={filters}
            handleFilterChange={handleFilterChange}
            doctors={doctors}
            specializations={specializations}
          /> */}

          <div className="overflow-x-auto">
            {isLoadingAppointments ? (
              <div className="flex justify-center items-center h-40">
                <LoadingState message="Loading appointments..." />
              </div>
            ) : (
              <AppointmentTable appointments={appointmentsData} />
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 md:flex-row md:justify-end">
          <Button
            size="lg"
            className="border-slate-200 bg-secondary text-slate-800 hover:bg-slate-200 hover:cursor-pointer"
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
