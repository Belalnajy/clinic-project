import { TabsContent } from '@/components/ui/tabs';
import React from 'react';
import AppointmentCompletion from '@/components/Reports/AppointmentCompletion';
import PatientGrowth from '@/components/Reports/PatientGrowth';
import AppointmentStatus from '@/components/Reports/AppointmentStatus';

const OverviewTab = ({ stats, appointmentCompletionData, appointmentStatusData }) => {
  return (
    <TabsContent value="overview" className="mt-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AppointmentCompletion
          completionRate={stats.appointmentStats.completionRate}
          total={stats.appointmentStats.total}
          completed={stats.appointmentStats.completed}
          appointmentCompletionData={appointmentCompletionData}
        />

        <PatientGrowth stats={stats.patientStats} />

        <AppointmentStatus appointmentStatusData={appointmentStatusData} />
      </div>
    </TabsContent>
  );
};

export default OverviewTab;
