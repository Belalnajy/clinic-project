import { TabsContent } from '@/components/ui/tabs';
import React from 'react';
import AppointmentCompletion from '@/components/Reports/AppointmentCompletion';
import PatientGrowth from '@/components/Reports/PatientGrowth';
import AppointmentStatus from '@/components/Reports/AppointmentStatus';
import { getAppointmentCompletionData } from '@/utils/getAppointmentCompletion';
import { getAppointmentStatusData } from '@/utils/appointmentStatusData';
import LoadingState from '@/components/LoadingState';

const OverviewTab = ({ appointmentMetrics, patientAnalysis, isLoading }) => {
  if (isLoading) {
    return (
      <TabsContent value="overview" className="mt-6">
        <div className="flex justify-center items-center h-[800px]">
          <LoadingState message="Loading overview..." className="scale-250" />
        </div>
      </TabsContent>
    );
  }

  const appointmentCompletionData = getAppointmentCompletionData(appointmentMetrics);
  const appointmentStatus = getAppointmentStatusData(appointmentMetrics);
  return (
    <TabsContent value="overview" className="mt-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AppointmentCompletion
          completionRate={appointmentMetrics.completion.completionRate}
          total={appointmentMetrics.completion.total}
          completed={appointmentMetrics.completion.completed}
          appointmentCompletionData={appointmentCompletionData}
        />

        <PatientGrowth stats={patientAnalysis.patientGrowth} />

        <AppointmentStatus appointmentStatusData={appointmentStatus} />
      </div>
    </TabsContent>
  );
};

export default OverviewTab;
