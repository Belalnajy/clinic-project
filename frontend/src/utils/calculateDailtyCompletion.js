export const calculateDailyCompletion = (appointments, timeRangeDays) => {
  const today = new Date();
  const startDate = new Date();
  startDate.setDate(today.getDate());

  const dailyData = {};

  appointments.forEach((appointment) => {
    const appointmentDate = new Date(appointment.date);
    if (appointmentDate >= startDate) {
      const dateKey = appointmentDate.toISOString().split('T')[0];
      if (!dailyData[dateKey]) {
        dailyData[dateKey] = { date: dateKey, completed: 0, total: 0 };
      }
      dailyData[dateKey].total += 1;
      if (appointment.status === 'Completed') {
        dailyData[dateKey].completed += 1;
      }
    }
  });
  return Object.values(dailyData)
    .sort((a, b) => new Date(a.date) - new Date(b.date)) // Sort by date in ascending order
    .map((data) => ({
      ...data,
    }));
};
