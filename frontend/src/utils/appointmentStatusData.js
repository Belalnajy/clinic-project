export function getAppointmentStatusData(metrics) {
  return metrics.statuses.map((status) => ({
    name: status.status.charAt(0).toUpperCase() + status.status.slice(1),
    value: status.count,
    fill: `var(--color-${status.status})`,
  }));
}
