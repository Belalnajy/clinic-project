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

const Reports = () => {
  const user = { role: 'manager' };
  const [timeRange, setTimeRange] = useState('7days');
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    // Load data from local storage
    setAppointments(getAllAppointments());
    setPatients(getAllPatients());
    setDoctors(getAllDoctors());
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

  const stats = calculateStats();

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
        </Tabs>
      </div>
    </>
  );
};

export default Reports;
