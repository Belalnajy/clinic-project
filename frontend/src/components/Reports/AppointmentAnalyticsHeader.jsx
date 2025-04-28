import React from 'react';
import AppointmentStatus from '@/components/Reports/AppointmentStatus';
import DailyCompletionChart from '@/components/Reports/DailyCompletionChart';
import AppointmentCompletion from '@/components/Reports/AppointmentCompletion';
import { getAppointmentStatusData } from '@/utils/appointmentStatusData';
import { getAppointmentCompletionData } from '@/utils/getAppointmentCompletion';

const AppointmentAnalyticsHeader = ({ appointmentMetrics }) => {
  const appointmentStatus = appointmentMetrics ? getAppointmentStatusData(appointmentMetrics) : [];
  const appointmentCompletionData = appointmentMetrics
    ? getAppointmentCompletionData(appointmentMetrics)
    : [];
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
      <AppointmentStatus appointmentStatusData={appointmentStatus} />
      {appointmentMetrics && (
        <>
          <DailyCompletionChart dailyCompletionData={appointmentMetrics.dailyCompletion} />
          <AppointmentCompletion
            completionRate={appointmentMetrics.completion.completionRate}
            total={appointmentMetrics.completion.total}
            completed={appointmentMetrics.completion.completed}
            appointmentCompletionData={appointmentCompletionData}
          />
        </>
      )}
    </div>
  );
};

export default AppointmentAnalyticsHeader;
