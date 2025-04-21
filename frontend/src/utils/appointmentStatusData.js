export function getAppointmentStatusData(stats) {
  return [
    { name: 'Scheduled', value: stats.appointmentStats.scheduled, fill: 'var(--color-scheduled)' },
    { name: 'In-Queue', value: stats.appointmentStats.inQueue, fill: 'var(--color-in_queue)' },
    { name: 'Completed', value: stats.appointmentStats.completed, fill: 'var(--color-completed)' },
    { name: 'Cancelled', value: stats.appointmentStats.cancelled, fill: 'var(--color-cancelled)' },
  ];
}
