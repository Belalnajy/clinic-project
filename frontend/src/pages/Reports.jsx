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
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

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

  const appointmentStatusData = [
    { name: 'Scheduled', value: stats.appointmentStats.scheduled },
    { name: 'In-Queue', value: stats.appointmentStats.inQueue },
    { name: 'Completed', value: stats.appointmentStats.completed },
    { name: 'Cancelled', value: stats.appointmentStats.cancelled },
  ];

  const patientGrowthData = [
    { name: 'New Patients', value: stats.patientStats.new },
    { name: 'Existing Patients', value: stats.patientStats.total - stats.patientStats.new },
  ];

  const doctorPerformanceData = stats.doctorStats.performance.map((doctor) => ({
    name: doctor.name,
    value: doctor.completionRate,
  }));

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
              {/* Appointments Chart */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Appointment Status</CardTitle>
                  <CardDescription>Distribution of appointment statuses</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie
                        data={appointmentStatusData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        label
                      >
                        {appointmentStatusData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={['#FFD700', '#1E90FF', '#32CD32', '#FF6347'][index]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Patient Growth Chart */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Patient Growth</CardTitle>
                  <CardDescription>New vs existing patients</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie
                        data={patientGrowthData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#82ca9d"
                        label
                      >
                        {patientGrowthData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={['#4CAF50', '#8BC34A'][index]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Doctor Performance Chart */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Doctor Performance</CardTitle>
                  <CardDescription>Completion rates by doctor</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={doctorPerformanceData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Reports;
