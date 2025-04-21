export function getAppointmentCompletionData(stats) {
  return [
    { name: 'Completed', value: stats.appointmentStats.completed, fill: 'var(--color-completed)' },
    {
      name: 'Remaining',
      value: stats.appointmentStats.total - stats.appointmentStats.completed,
      fill: 'var(--color-remaining)',
    },
  ];
}
