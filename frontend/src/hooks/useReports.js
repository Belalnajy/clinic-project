import { calculateStats } from '@/utils/calculateReportStats';
import { calculateDailyCompletion } from '@/utils/calculateDailtyCompletion';
import { getAppointmentCompletionData } from '@/utils/getAppointmentCompletion';
import { getAppointmentStatusData } from '@/utils/appointmentStatusData';
import Papa from 'papaparse';
import { getAllAppointments, getAllPatients, getAllDoctors, getAllSpecializations } from '../data/data';
import { useState, useEffect } from 'react';

export function useReports() {
  const user = { role: 'manager' };
  const [timeRange, setTimeRange] = useState('7days');
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);

  const [filters, setFilters] = useState({
    location: '',
    provider: '',
    appointmentType: '',
    status: '',
  });

  useEffect(() => {
    // Load data from local storage
    const loadedAppointments = getAllAppointments();
    const loadedPatients = getAllPatients();
    const loadedDoctors = getAllDoctors();
    const loadedSpecializations = getAllSpecializations();




    // Enrich appointments with patientName, providerName, and specialization
    const enrichedAppointments = loadedAppointments.map((appointment) => {
      const doctor = loadedDoctors.find((doc) => doc.id === appointment.doctorId);
      const patient = loadedPatients.find((pat) => pat.id === appointment.patientId);
      return {
        ...appointment,
        providerName: doctor ? doctor.name : 'Unknown Provider',
        patientName: patient ? patient.fullName : 'Unknown Patient',
      };
    });

    setAppointments(enrichedAppointments);
    setPatients(loadedPatients);
    setDoctors(loadedDoctors);
    setSpecializations(loadedSpecializations);

  }, []);

  const stats = calculateStats(appointments, patients, doctors, timeRange, specializations);

  const dailyCompletionData = calculateDailyCompletion(appointments, 7);

  const appointmentCompletionData = getAppointmentCompletionData(stats);

  const appointmentStatusData = getAppointmentStatusData(stats);

  const handleFilterChange = (filterKey, value) => {
    setFilters((prevFilters) => ({ ...prevFilters, [filterKey]: value }));
  };

  const filteredAppointments = appointments.filter((appointment) => {
    return (
      (!filters.location || appointment.specializationName === filters.location) &&
      (!filters.provider || appointment.doctorId === filters.provider) &&
      (!filters.appointmentType || appointment.type === filters.appointmentType) &&
      (!filters.status || appointment.status === filters.status)
    );
  });

  const uniqueSpecializations = [
    ...new Set(appointments.map((appointment) => appointment.specializationName)),
  ];

  const uniqueProviders = [
    ...new Map(
      appointments.map((appointment) => [
        appointment.doctorId,
        { id: appointment.doctorId, name: appointment.providerName },
      ])
    ).values(),
  ];

  const handleExportData = () => {
    const csvData = filteredAppointments.map((appointment) => ({
      AppointmentID: appointment.id,
      PatientName: appointment.patientName,
      ProviderName: appointment.providerName,
      Date: appointment.date,
      Status: appointment.status,
      Type: appointment.type,
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'appointments_report.csv');
    link.click();
    URL.revokeObjectURL(url);
  };

  return {
    user,
    stats,
    dailyCompletionData,
    appointmentCompletionData,
    appointmentStatusData,
    filters,
    handleFilterChange,
    filteredAppointments,
    uniqueSpecializations,
    uniqueProviders,
    handleExportData,
    timeRange,
    setTimeRange,
    patients,
  };
}
