import { useAuth } from '@/contexts/Auth/useAuth';
import { useNavigate } from 'react-router-dom';
import StatsSection from '@/components/dashboard/StatsSection';
import TabsHeader from '@/components/dashboard/TabsHeader';
import { useState } from 'react';
import { Tabs, TabsContent } from '@radix-ui/react-tabs';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';

import { Filter, UserPlus, Users, ArrowsUpFromLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ScheduleTable from '@/components/dashboard/ScheduleTable';
import { getTodayAppointments } from '../data/data';
import CheckInTab from '@/components/dashboard/CheckInTab';

export default function SecretaryDashboard() {
  const todayAppointments = getTodayAppointments();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const filteredAppointments = todayAppointments.filter((appointment) =>
    appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleOpenPatientView = (patient) => {
    navigate(`/patient/${patient.patientId}`);
  };

  const handleNewAppointment = () => {
    toast({
      title: 'New Appointment',
      description: 'Appointment has been scheduled successfully.',
    });
  };
  const completedAppointments = todayAppointments.filter((a) => a.status === 'completed').length;
  const completionRate = Math.round((completedAppointments / todayAppointments.length) * 100) || 0;

  const statusStyles = {
    completed: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    waiting: 'bg-amber-50 text-amber-700 border border-amber-200',
    'in-progress': 'bg-sky-50 text-sky-700 border border-sky-200',
    cancelled: 'bg-rose-50 text-rose-700 border border-rose-200',
  };
  return (
    <div className="p-6 md:p-8">
      <div className="mb-8 border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-light tracking-tight text-slate-800 bg-mint-500">
          Secretary's dashboard
        </h1>
        <p className="text-slate-500 mt-1 text-sm">Welcome back, Mr. John Smith</p>
      </div>
      {/* Stats Section */}
      <StatsSection />
      <Tabs defaultValue="appointments" className="mb-8">
        <TabsHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        {/* Appointments */}
        <TabsContent value="appointments" className="mt-0">
          <ScheduleTable
            appointments={filteredAppointments}
            handleOpenPatientView={handleOpenPatientView}
            statusStyles={statusStyles}
            handleNewAppointment={handleNewAppointment}
            completionRate={completionRate}
          />
        </TabsContent>
        {/* Check-in */}
        <TabsContent value="check-in">
          <CheckInTab/>
        </TabsContent>

        {/* Patients */}
        <TabsContent value="patients">
          <div className="rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="border-b border-slate-100 bg-primary-300 py-7 px-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-white">
                  My Patient List
                </h2>
                <p className="text-slate-100 mt-1">All active patients under your care</p>
              </div>
              <div className="flex  flex-wrap gap-3 ">
                <Button
                  size="sm"
                  className="border-slate-200 text-slate-800 bg-secondary hover:bg-slate-200"
                >
                  <Filter size={16} className="mr-2 text-slate-800" />
                  Filter
                </Button>
                <Button
                  size="sm"
                  className="border-slate-200 text-slate-800 bg-secondary hover:bg-slate-200"
                >
                  <ArrowsUpFromLine size={16} className="mr-2 text-slate-800" />
                  Sort
                </Button>
                <Button
                  size="sm"
                  className="border-slate-200 text-slate-800 bg-secondary hover:bg-slate-200"
                  onClick={() => console.log('New Patient Clicked')}
                >
                  <UserPlus size={16} className="mr-2 text-slate-800" />
                  New Patient
                </Button>
              </div>
            </div>

            <div className="p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12 text-slate-500">
                      <Users size={32} className="mx-auto mb-3 text-slate-300" />
                      Patient list content would appear here
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
