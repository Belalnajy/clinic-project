import { useAuth } from '@/contexts/Auth/useAuth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import StatsSection from '@/components/dashboard/StatsSection';
import TabsHeader from '@/components/dashboard/TabsHeader';
import { useState, useEffect } from 'react';
import { Tabs, TabsContent } from '@radix-ui/react-tabs';
import PatientsTab from '@/components/dashboard/PatientsTab';
import ScheduleTable from '@/components/dashboard/ScheduleTable';

import CheckInTab from '@/components/dashboard/CheckInTab';
import LoadingState from '@/components/LoadingState';
import CustomAlert from '@/components/CustomAlert';
import useAppointments from '@/hooks/useAppointments';
import { usePatientsList } from '@/hooks/usePatients';

export default function SecretaryDashboard() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();

  // Get appointments data using custom hook
  const {
    todayAppointments,
    dashboardStats,
    isLoadingTodayAppointments,
    todayAppointmentsError,
    isLoadingStats,
    statsError,
    todayAppointmentsPagination,
  } = useAppointments();

  // Get patients data using custom hook
  const {
    patientsData,
    isLoading: isLoadingPatients,
    error: patientsError,
    pagination: patientsPagination,
  } = usePatientsList();
  // Reset to first page when search term changes
  useEffect(() => {
    setSearchParams({ page: 1 });
  }, [searchTerm]);

  // Filter appointments based on search term
  const filteredAppointments = todayAppointments.filter((appointment) => {
    const name = appointment.patient
      ? `${appointment.patient.first_name || ''} ${appointment.patient.last_name || ''}`.trim()
      : appointment.patient_name || '';
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Calculate completion rate
  const completedAppointments = todayAppointments.filter((a) => a.status === 'completed').length;
  const completionRate = Math.round((completedAppointments / todayAppointments.length) * 100) || 0;

  // Status styles for appointments
  const statusStyles = {
    completed: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    waiting: 'bg-amber-50 text-amber-700 border border-amber-200',
    'in-progress': 'bg-sky-50 text-sky-700 border border-sky-200',
    cancelled: 'bg-rose-50 text-rose-700 border border-rose-200',
  };

  // Loading state
  if (isLoadingTodayAppointments || isLoadingStats || isLoadingPatients) {
    return <LoadingState fullPage={true} message="Loading dashboard data..." />;
  }

  // Error state
  if (todayAppointmentsError || statsError || patientsError) {
    return (
      <CustomAlert
        message="Failed to load dashboard data"
        description="Please try refreshing the page or contact support if the issue persists."
        variant="destructive"
      />
    );
  }

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8 border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-light tracking-tight text-slate-800">Secretary's dashboard</h1>
        <p className="text-slate-500 mt-1 text-sm">Welcome back, {user?.name || 'Secretary'}</p>
      </div>

      {/* Stats Section */}
      <StatsSection stats={dashboardStats} />

      <Tabs defaultValue="appointments" className="mb-8">
        <TabsHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        {/* Appointments Tab */}
        <TabsContent value="appointments" className="mt-0">
          <ScheduleTable
            appointments={filteredAppointments}
            loading={isLoadingTodayAppointments}
            error={todayAppointmentsError}
            handleOpenPatientView={(patient) => navigate(`/patient/${patient.patientId}`)}
            statusStyles={statusStyles}
            completionRate={completionRate}
            currentPage={todayAppointmentsPagination.currentPage}
            totalPages={Math.ceil(todayAppointmentsPagination.count / 10)}
            totalItems={todayAppointmentsPagination.count}
            onPageChange={(page) => setSearchParams({ page })}
          />
        </TabsContent>

        {/* Check-in Tab */}
        <TabsContent value="check-in">
          <CheckInTab />
        </TabsContent>

        {/* Patients Tab */}
        <TabsContent value="patients">
          <PatientsTab
            patients={patientsData}
            loading={isLoadingPatients}
            error={patientsError}
            currentPage={patientsPagination.currentPage}
            totalPages={patientsPagination.totalPages}
            totalItems={patientsPagination.count}
            onPageChange={(page) => setSearchParams({ page })}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
