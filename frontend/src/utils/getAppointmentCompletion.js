export function getAppointmentCompletionData(metrics) {
  return [
    { name: 'Completed', value: metrics.completion.completed, fill: 'var(--color-completed)' },
    { name: 'Remaining', value: metrics.completion.remaining, fill: 'var(--color-remaining)' },
  ];
}
