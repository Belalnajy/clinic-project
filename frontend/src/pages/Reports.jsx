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
import { getAllAppointments, getAllPatients, getAllDoctors } from '../data/data';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Progress } from '@/components/ui/progress';
import AppointmentCompletion from '@/components/Reports/AppointmentCompletion';
import PatientGrowth from '@/components/Reports/PatientGrowth';
import AppointmentStatus from '@/components/Reports/AppointmentStatus';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import DailyCompletionChart from '@/components/Reports/DailyCompletionChart';
import AppointmentTable from '@/components/Reports/AppointmentTable';
import TableFilters from '@/components/Reports/TableFilters';

const Reports = () => {
  const user = { role: 'manager' };
  const [timeRange, setTimeRange] = useState('7days');
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
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

    console.log('loadedAppointments', loadedAppointments);
    console.log('loadedPatients', loadedPatients);
    console.log('loadedDoctors', loadedDoctors);

    // Enrich appointments with patientName, providerName, and specialization
    // console.log(loadedAppointments);
    const enrichedAppointments = loadedAppointments.map((appointment) => {
      const doctor = loadedDoctors.find((doc) => doc.id === appointment.doctorId);
      const patient = loadedPatients.find((pat) => pat.id === appointment.patientId);
      console.log('doctor', doctor);
      console.log('patient', patient);
      return {
        ...appointment,
        providerName: doctor ? doctor.name : 'Unknown Provider',
        patientName: patient ? patient.fullName : 'Unknown Patient',
        // specialization: lookupSpecialization[appointment.doctorId] || 'Unknown Specialization',
      };
    });

    setAppointments(enrichedAppointments);
    console.log('enrichedAppointments', enrichedAppointments);
    setPatients(loadedPatients);
    setDoctors(loadedDoctors);
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
    const newPatients = patients.filter((p) => {
      const createdDate = new Date(p.createdAt);
      const rangeStartDate = new Date();
      rangeStartDate.setDate(rangeStartDate.getDate() - timeRangeDays);
      return createdDate >= rangeStartDate;
    }).length;
    const patientGrowthRate =
      totalPatients > 0 ? Math.round((newPatients / totalPatients) * 100) : 0;

    // Doctor statistics
    const totalDoctors = doctors.length;
    const doctorPerformance = doctors.map((doctor) => {
      const doctorAppointments = appointments.filter((a) => a.doctorId === doctor.id);
      const completed = doctorAppointments.filter((a) => a.status === 'Completed').length;
      const total = doctorAppointments.length;
      const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

      return {
        id: doctor.id,
        name: doctor.name,
        specialization: doctor.specialization,
        appointments: total,
        completionRate,
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
    startDate.setDate(today.getDate() - timeRangeDays);

    const dailyData = {};

    appointments.forEach((appointment) => {
      const appointmentDate = new Date(appointment.date);
      if (appointmentDate >= startDate && appointmentDate <= today) {
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

    return Object.values(dailyData).map((data) => ({
      ...data,
      completionRate: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0,
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
    { name: 'Completed', value: stats.appointmentStats.completed },
    { name: 'Remaining', value: stats.appointmentStats.total - stats.appointmentStats.completed },
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

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Reports & Analytics</h1>
        <p className="text-slate-500">View insights and performance metrics for your clinic</p>
      </div>

      <div className="mb-6 flex justify-between items-center">
        <Tabs defaultValue="overview" className="w-full">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="patients">Patients</TabsTrigger>
              {user.role === 'manager' && <TabsTrigger value="doctors">Doctors</TabsTrigger>}
            </TabsList>

            <Select defaultValue={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
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
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Appointment Completion</CardTitle>
                  <CardDescription>Overall completion rate</CardDescription>
                </CardHeader>
                <CardContent>
                  <AppointmentCompletion
                    completionRate={stats.appointmentStats.completionRate}
                    total={stats.appointmentStats.total}
                    completed={stats.appointmentStats.completed}
                  />
                </CardContent>
                <CardFooter className="flex justify-between text-sm text-slate-500">
                  <div>Total: {stats.appointmentStats.total}</div>
                  <div>Completed: {stats.appointmentStats.completed}</div>
                </CardFooter>
              </Card>

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

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Appointment Status</CardTitle>
                  <CardDescription>Distribution by status</CardDescription>
                </CardHeader>
                <CardContent>
                  <AppointmentStatus stats={stats.appointmentStats} />
                </CardContent>
                <CardFooter className="flex justify-between text-sm text-slate-500">
                  <div>Total: {stats.appointmentStats.total}</div>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="appointments" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Appointment Analytics</CardTitle>
                <CardDescription>Detailed analysis of appointment data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6 grid gap-6 md:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Appointment Status</CardTitle>
                      <CardDescription>Distribution by status</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <AppointmentStatus stats={stats.appointmentStats} />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Daily Completion</CardTitle>
                      <CardDescription>Completion rate for each day</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <DailyCompletionChart data={dailyCompletionData} />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Appointment Completion</CardTitle>
                      <CardDescription>Overall completion rate</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <AppointmentCompletion
                        completionRate={stats.appointmentStats.completionRate}
                        total={stats.appointmentStats.total}
                        completed={stats.appointmentStats.completed}
                      />
                    </CardContent>
                  </Card>
                </div>

                <TableFilters
                  filters={filters}
                  handleFilterChange={handleFilterChange}
                  uniqueSpecializations={uniqueSpecializations}
                  uniqueProviders={uniqueProviders}
                />

                <AppointmentTable appointments={filteredAppointments} />
              </CardContent>
              <CardFooter className="flex justify-between">
                <div>
                  <Button variant="outline">
                    <i className="fas fa-download mr-2"></i> Export Data
                  </Button>
                </div>
                <div>
                  <Button variant="outline">
                    <i className="fas fa-print mr-2"></i> Print Report
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Reports;
