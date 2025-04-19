import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  getAllAppointments,
  getAllPatients,
  getAllDoctors,
  getAllSpecializations,
} from '../data/data';
import AppointmentCompletion from '@/components/Reports/AppointmentCompletion';
import PatientGrowth from '@/components/Reports/PatientGrowth';
import AppointmentStatus from '@/components/Reports/AppointmentStatus';
import DoctorPerformance from '@/components/Reports/DoctorPerformance';
import DailyCompletionChart from '@/components/Reports/DailyCompletionChart';
import AppointmentTable from '@/components/Reports/AppointmentTable';
import TableFilters from '@/components/Reports/TableFilters';
import PatientDemographics from '../components/Reports/PatientDemographics';
import Papa from 'papaparse';
import { FileArchive } from 'lucide-react';

const Reports = () => {
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
    // console.log(loadedSpecializations);

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

  // Calculate statistics
  const calculateStats = () => {
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
    const patientGrowthRate =
      totalPatients > 0 ? Math.round((newPatients / totalPatients) * 100) : 0;

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

  const calculateDailyCompletion = (appointments, timeRangeDays) => {
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

  const stats = calculateStats();

  const dailyCompletionData = calculateDailyCompletion(
    appointments,
    {
      '7days': 7,
      '30days': 30,
      '90days': 90,
      year: 365,
    }[timeRange]
  );

  const getCompletionColor = (completionRate) => {
    if (completionRate <= 25) return '#EF4444'; // Red
    if (completionRate > 25 && completionRate <= 50) return '#FBBF24'; // Yellow
    if (completionRate > 50 && completionRate <= 75) return '#3B82F6'; // Blue
    return '#10B981'; // Green
  };

  const appointmentCompletionData = [
    { name: 'Completed', value: stats.appointmentStats.completed, fill: 'var(--color-completed)' },
    {
      name: 'Remaining',
      value: stats.appointmentStats.total - stats.appointmentStats.completed,
      fill: 'var(--color-remaining)',
    },
  ];

  const appointmentStatusData = [
    { name: 'Scheduled', value: stats.appointmentStats.scheduled, fill: 'var(--color-scheduled)' },
    { name: 'In-Queue', value: stats.appointmentStats.inQueue, fill: 'var(--color-in_queue)' },
    { name: 'Completed', value: stats.appointmentStats.completed, fill: 'var(--color-completed)' },
    { name: 'Cancelled', value: stats.appointmentStats.cancelled, fill: 'var(--color-cancelled)' },
  ];

  const COLORS = [
    getCompletionColor(stats.appointmentStats.completionRate), // Dynamic color for "Completed"
    '#E5E7EB', // Gray for "Remaining"
  ];

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

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Reports & Analytics</h1>
        <p className="text-slate-500">View insights and performance metrics for your clinic</p>
      </div>

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
        <Tabs defaultValue="overview" className="w-full">
          <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
            <TabsList className="flex flex-wrap gap-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="patients">Patients</TabsTrigger>
              {user.role === 'manager' && <TabsTrigger value="doctors">Doctors</TabsTrigger>}
            </TabsList>

            <Select defaultValue={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Select time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="90days">Last 90 Days</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <TabsContent value="overview" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <AppointmentCompletion
                completionRate={stats.appointmentStats.completionRate}
                total={stats.appointmentStats.total}
                completed={stats.appointmentStats.completed}
                appointmentCompletionData={appointmentCompletionData}
              />
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Patient Growth</CardTitle>
                  <CardDescription>New patient registrations</CardDescription>
                </CardHeader>
                <CardContent>
                  <PatientGrowth
                    newPatients={stats.patientStats.new}
                    totalPatients={stats.patientStats.total}
                    growthRate={stats.patientStats.growthRate}
                  />
                </CardContent>
                <CardFooter className="flex justify-between text-sm text-slate-500">
                  <div>Total Patients: {stats.patientStats.total}</div>
                </CardFooter>
              </Card>

              <AppointmentStatus appointmentStatusData={appointmentStatusData} />
            </div>
          </TabsContent>
          <TabsContent value="appointments" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Appointment Analytics</CardTitle>
                <CardDescription>Detailed analysis of appointment data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <AppointmentStatus appointmentStatusData={appointmentStatusData} />

                  <DailyCompletionChart dailyCompletionData={dailyCompletionData} />

                  <AppointmentCompletion
                    completionRate={stats.appointmentStats.completionRate}
                    total={stats.appointmentStats.total}
                    completed={stats.appointmentStats.completed}
                    appointmentCompletionData={appointmentCompletionData}
                  />
                </div>

                <TableFilters
                  filters={filters}
                  handleFilterChange={handleFilterChange}
                  uniqueSpecializations={uniqueSpecializations}
                  uniqueProviders={uniqueProviders}
                />

                <div className="overflow-x-auto">
                  <AppointmentTable appointments={filteredAppointments} />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4 md:flex-row md:justify-end">
                <Button
                  size="lg"
                  className="border-slate-200 bg-secondary text-slate-800 hover:bg-slate-200  hover:cursor-pointer"
                  onClick={handleExportData}
                >
                  <FileArchive size={16} className="mr-2 text-slate-800" />
                  Export
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="patients" className="mt-6">
            <PatientDemographics patients={patients} />
          </TabsContent>
          {user.role === 'manager' && (
            <TabsContent value="doctors" className="mt-6">
              <DoctorPerformance stats={stats} />
            </TabsContent>
          )}{' '}
        </Tabs>
      </div>
    </>
  );
};

export default Reports;
