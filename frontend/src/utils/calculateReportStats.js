// Calculate statistics
export const calculateStats = (appointments, patients, doctors, timeRange, specializations) => {
  // Appointment statistics
  const totalAppointments = appointments.length;
  const completedAppointments = appointments.filter((a) => a.status === 'Completed').length;
  const cancelledAppointments = appointments.filter((a) => a.status === 'Cancelled').length;
  const inQueueAppointments = appointments.filter((a) => a.status === 'In-Queue').length;
  const scheduledAppointments = appointments.filter((a) => a.status === 'Scheduled').length;

  const appointmentCompletionRate =
    totalAppointments > 0 ? Math.round((completedAppointments / totalAppointments) * 100) : 0;

  // Patient statistics
  const totalPatients = patients.length;
  const timeRangeDays = {
    '7days': 7,
    '30days': 30,
    '90days': 90,
    year: 365,
  }[timeRange];

  const newPatients = 4;
  const patientGrowthRate = totalPatients > 0 ? Math.round((newPatients / totalPatients) * 100) : 0;

  // Doctor statistics
  const totalDoctors = doctors.length;
  const doctorPerformance = doctors.map((doctor) => {
    const doctorAppointments = appointments.filter((a) => a.doctorId === doctor.id);
    const completed = doctorAppointments.filter((a) => a.status === 'Completed').length;
    const total = doctorAppointments.length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    const specialization = specializations.find(
      (spec) => spec.id === doctor.specializationId
    )?.name;

    // console.log(specialization);

    return {
      id: doctor.id,
      name: doctor.name,
      specialization: doctor.specialization,
      appointments: total,
      completionRate,
      specialization: specialization,
    };
  });

  const averageAppointmentsPerDoctor =
    totalDoctors > 0 ? Math.round(appointments.length / totalDoctors) : 0;
  const highPerformingDoctors = doctorPerformance.filter((d) => d.completionRate > 80).length;
  const highPerformingRate =
    totalDoctors > 0 ? Math.round((highPerformingDoctors / totalDoctors) * 100) : 0;

  return {
    appointmentStats: {
      total: totalAppointments,
      completed: completedAppointments,
      cancelled: cancelledAppointments,
      inQueue: inQueueAppointments,
      scheduled: scheduledAppointments,
      completionRate: appointmentCompletionRate,
    },
    patientStats: {
      total: totalPatients,
      new: newPatients,
      growthRate: patientGrowthRate,
    },
    doctorStats: {
      total: totalDoctors,
      performance: doctorPerformance,
      averageAppointments: averageAppointmentsPerDoctor,
      highPerformingRate,
    },
  };
};
