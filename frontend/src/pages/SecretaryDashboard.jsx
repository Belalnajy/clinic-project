import { useAuth } from '@/contexts/Auth/useAuth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import StatsSection from '@/components/dashboard/StatsSection';
import TabsHeader from '@/components/dashboard/TabsHeader';
import { useState, useEffect } from 'react';
import { Tabs, TabsContent } from '@radix-ui/react-tabs';
import PatientsTab from '@/components/dashboard/PatientsTab';
import ScheduleTable from '@/components/dashboard/ScheduleTable';
import { getDashboardStatistics } from '@/api/statistics';
import { getTodayAppointments } from '@/api/appointments';
import { getPatients } from '@/api/patients';
import CheckInTab from '@/components/dashboard/CheckInTab';

export default function SecretaryDashboard() {
  const [stats, setStats] = useState({});
  // Sync appointmentsPage with ?page in URL
  
  const [searchParams, setSearchParams] = useSearchParams();
  const appointmentsPage = Number(searchParams.get('page')) || 1;
  const [appointmentsTotalPages, setAppointmentsTotalPages] = useState(1);
  const [appointmentsTotalItems, setAppointmentsTotalItems] = useState(0);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);
  const [appointmentsError, setAppointmentsError] = useState(null);
  const [patients, setPatients] = useState([]);
  const [patientsLoading, setPatientsLoading] = useState(true);
  const [patientsError, setPatientsError] = useState(null);
  const [patientsPage, setPatientsPage] = useState(1);
  const [patientsTotalPages, setPatientsTotalPages] = useState(1);
  const [patientsTotalItems, setPatientsTotalItems] = useState(0);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch dashboard statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsData = await getDashboardStatistics();
        setStats(statsData);
      } catch (err) {
        setStats({});
      }
    };
    fetchStats();
  }, []);



  // Fetch all patients (with pagination)
  useEffect(() => {
    const fetchPatients = async () => {
      setPatientsLoading(true);
      setPatientsError(null);
      try {
        const data = await getPatients(patientsPage);
        setPatients(data.results || []);
        setPatientsTotalPages(data.total_pages || 1);
        setPatientsTotalItems(data.count || 0);
      } catch (err) {
        setPatientsError('Failed to load patients');
        setPatients([]);
        setPatientsTotalPages(1);
        setPatientsTotalItems(0);
      } finally {
        setPatientsLoading(false);
      }
    };
    fetchPatients();
  }, [patientsPage]);

 
  useEffect(() => {
    const fetchAppointments = async () => {
      setAppointmentsLoading(true);
      setAppointmentsError(null);
      try {
        const data = await getTodayAppointments(appointmentsPage);
        setTodayAppointments(data.results || []);
        setAppointmentsTotalPages(data.total_pages || 1);
        setAppointmentsTotalItems(data.count || 0);
      } catch (err) {
        setAppointmentsError('Failed to load appointments');
        setTodayAppointments([]);
        setAppointmentsTotalPages(1);
        setAppointmentsTotalItems(0);
      } finally {
        setAppointmentsLoading(false);
      }
    };
    fetchAppointments();
  }, [appointmentsPage]);

  // Reset to first page when search term changes
  useEffect(() => {
    setSearchParams({ page: 1 });
  }, [searchTerm]);

  // Filtered appointments (if you want to filter by searchTerm, apply on todayAppointments)
  const filteredAppointments = todayAppointments.filter((appointment) => {
    let name = '';
    if (appointment.patient && (appointment.patient.first_name || appointment.patient.last_name)) {
      name = `${appointment.patient.first_name || ''} ${appointment.patient.last_name || ''}`.trim();
    } else if (appointment.patient_name) {
      name = appointment.patient_name;
    }
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });
  const handleOpenPatientView = (patient) => {
    navigate(`/patient/${patient.patientId}`);
  };

  const handleNewAppointment = () => {
    // You can implement appointment creation logic here
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
      <StatsSection stats={stats} />
      <Tabs defaultValue="appointments" className="mb-8">
        <TabsHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        {/* Appointments */}
        <TabsContent value="appointments" className="mt-0">
          <ScheduleTable
            appointments={filteredAppointments}
            loading={appointmentsLoading}
            error={appointmentsError}
            handleOpenPatientView={handleOpenPatientView}
            statusStyles={statusStyles}
            handleNewAppointment={handleNewAppointment}
            completionRate={completionRate}
            currentPage={appointmentsPage}
            totalPages={appointmentsTotalPages}
            totalItems={appointmentsTotalItems}
            onPageChange={(page) => setSearchParams({ page })}
          />
        </TabsContent>
        {/* Check-in */}
        <TabsContent value="check-in">
          {/* <CheckInTab /> */}
        </TabsContent>
        {/* Patients */}
        <TabsContent value="patients">
          <PatientsTab
            patients={patients}
            loading={patientsLoading}
            error={patientsError}
            currentPage={patientsPage}
            totalPages={patientsTotalPages}
            totalItems={patientsTotalItems}
            onPageChange={setPatientsPage}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
