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

const AppointmentsTab = ({
  appointmentMetrics,
  appointmentsData,
  isLoadingAppointments,
  doctors,
  specializations,
}) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    doctor: searchParams.get('doctor') || '',
    specialization: searchParams.get('specialization') || '',
    status: searchParams.get('status') || '',
    date: searchParams.get('date') ? new Date(searchParams.get('date')) : null,
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
      if (filterName === 'date') {
        if (value instanceof Date) {
          // Single date
          const year = value.getFullYear();
          const month = String(value.getMonth() + 1).padStart(2, '0');
          const day = String(value.getDate()).padStart(2, '0');
          newSearchParams.set('date', `${year}-${month}-${day}`);
          newSearchParams.delete('startDate');
          newSearchParams.delete('endDate');
        } else if (typeof value === 'object' && value.startDate && value.endDate) {
          // Date range
          const start = value.startDate;
          const end = value.endDate;
          const startStr = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}-${String(start.getDate()).padStart(2, '0')}`;
          const endStr = `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, '0')}-${String(end.getDate()).padStart(2, '0')}`;
          newSearchParams.set('startDate', startStr);
          newSearchParams.set('endDate', endStr);
          newSearchParams.delete('date');
        }
      } else {
        newSearchParams.set(filterName, value);
      }
    } else {
      newSearchParams.delete(filterName);
      newSearchParams.delete('startDate');
      newSearchParams.delete('endDate');
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
