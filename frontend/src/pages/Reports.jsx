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
    const newPatients = patients.filter((p) => {
      const createdDate = new Date(p.createdAt);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return createdDate >= thirtyDaysAgo;
    }).length;

    // Doctor statistics
    const totalDoctors = doctors.length;

    // Doctor performance (simplified for demo)
    const doctorPerformance = doctors.map((doctor) => {
      const doctorAppointments = appointments.filter((a) => a.doctorId === doctor.id);
      const completed = doctorAppointments.filter((a) => a.status === 'confirmed').length;
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
      },
      doctorStats: {
        total: totalDoctors,
        performance: doctorPerformance,
      },
    };
  };

  const stats = calculateStats();

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
                  <div className="flex items-center justify-center py-8">
                    <div className="relative h-40 w-40">
                      {/* Circular progress (simplified) */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="h-full w-full" viewBox="0 0 100 100">
                          <circle
                            className="text-slate-100 stroke-current"
                            strokeWidth="10"
                            cx="50"
                            cy="50"
                            r="40"
                            fill="transparent"
                          ></circle>
                          <circle
                            className="text-primary-600 stroke-current"
                            strokeWidth="10"
                            strokeLinecap="round"
                            cx="50"
                            cy="50"
                            r="40"
                            fill="transparent"
                            strokeDasharray={`${2 * Math.PI * 40}`}
                            strokeDashoffset={`${
                              2 * Math.PI * 40 * (1 - stats.appointmentStats.completionRate / 100)
                            }`}
                            transform="rotate(-90 50 50)"
                          ></circle>
                        </svg>
                        <div className="absolute text-3xl font-bold">
                          {stats.appointmentStats.completionRate}%
                        </div>
                      </div>
                    </div>
                  </div>
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
                  <div className="h-[240px] flex flex-col items-center justify-center">
                    <div className="text-5xl font-bold text-primary-600">
                      {stats.patientStats.new}
                    </div>
                    <div className="text-sm text-slate-500 mt-2">New patients in last 30 days</div>
                    <div className="mt-6 w-full bg-slate-100 rounded-full h-4 overflow-hidden">
                      <div
                        className="bg-primary-600 h-full rounded-full"
                        style={{
                          width: `${(stats.patientStats.new / stats.patientStats.total) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <div className="mt-2 text-xs text-slate-500 self-end">
                      {Math.round((stats.patientStats.new / stats.patientStats.total) * 100)}%
                      growth rate
                    </div>
                  </div>
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
                  <div className="h-[240px] flex flex-col items-center justify-center space-y-4">
                    {/* Simplified chart representation */}
                    <div className="w-full space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Scheduled</span>
                        <span className="text-sm font-medium">
                          {stats.appointmentStats.scheduled}
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-yellow-500 h-full rounded-full"
                          style={{
                            width: `${
                              (stats.appointmentStats.scheduled / stats.appointmentStats.total) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="w-full space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">In-Queue</span>
                        <span className="text-sm font-medium">
                          {stats.appointmentStats.inQueue}
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-blue-500 h-full rounded-full"
                          style={{
                            width: `${
                              (stats.appointmentStats.inQueue / stats.appointmentStats.total) * 100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="w-full space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Completed</span>
                        <span className="text-sm font-medium">
                          {stats.appointmentStats.completed}
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-green-500 h-full rounded-full"
                          style={{
                            width: `${
                              (stats.appointmentStats.completed / stats.appointmentStats.total) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="w-full space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Cancelled</span>
                        <span className="text-sm font-medium">
                          {stats.appointmentStats.cancelled}
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-red-500 h-full rounded-full"
                          style={{
                            width: `${
                              (stats.appointmentStats.cancelled / stats.appointmentStats.total) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
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
