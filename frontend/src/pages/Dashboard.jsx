import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardStatistics } from '@/api/statistics';
import { getMedicalRecords } from '@/api/medicalRecords';
import { getPatients } from '@/api/patients';
import { getTodayAppointments } from '@/api/appointments';

import { Tabs, TabsContent } from '@/components/ui/tabs';
import Papa from 'papaparse';
import FilterDialog from '@/components/dashboard/FilterDialog';
import StatsSection from '@/components/dashboard/StatsSection';
import TabsHeader from '@/components/dashboard/TabsHeader';
import ScheduleTable from '@/components/dashboard/ScheduleTable';
import MedicalRecordsList from '@/components/dashboard/MedicalRecordsList';
import PatientsTab from '@/components/dashboard/PatientsTab';
import { useAuth } from '@/contexts/Auth/useAuth';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState(null);
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingRecords, setLoadingRecords] = useState(true);
  const [recordsError, setRecordsError] = useState(null);
  const [currentRecordPage, setCurrentRecordPage] = useState(1);
  const [totalRecordPages, setTotalRecordPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [appointmentsError, setAppointmentsError] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      setLoadingStats(true);
      setStatsError(null);
      try {
        const data = await getDashboardStatistics();
        setStats(data);
      } catch (err) {
        setStatsError('Failed to load statistics');
        setStats(null);
      } finally {
        setLoadingStats(false);
      }
    }
    fetchStats();
  }, []);

  useEffect(() => {
    async function fetchAppointments() {
      setLoadingAppointments(true);
      setAppointmentsError(null);
      try {
        const data = await getTodayAppointments();
        setAppointments(data.results || data); // handle paginated or direct array
      } catch (err) {
        setAppointments([]);
        setAppointmentsError('Failed to load today\'s appointments');
      } finally {
        setLoadingAppointments(false);
      }
    }
    fetchAppointments();
  }, []);

  // Fetch medical records from backend
  const fetchRecords = async (page = 1) => {
    setLoadingRecords(true);
    setRecordsError(null);
    try {
      const data = await getMedicalRecords(page);
      // Handle paginated response from API
      if (data && data.results && Array.isArray(data.results)) {
        setRecords(data.results);
        setTotalRecords(data.count || 0);
        setTotalRecordPages(Math.ceil((data.count || 0) / 10));
        console.log('API Pagination - Medical Records:', { 
          page, 
          count: data.count, 
          results: data.results.length,
          totalPages: Math.ceil((data.count || 0) / 10)
        });
      } else if (data && Array.isArray(data)) {
        // Fallback if API returns array directly
        setRecords(data);
        setTotalRecords(data.length);
        setTotalRecordPages(Math.ceil(data.length / 10));
      } else {
        // Fallback for unexpected data format
        setRecords([]);
        setTotalRecords(0);
        setTotalRecordPages(1);
        console.error('Unexpected data format for medical records:', data);
      }
    } catch (err) {
      setRecordsError('Failed to load medical records');
      console.error('Error fetching medical records:', err);
    } finally {
      setLoadingRecords(false);
    }
  };

  useEffect(() => {
    fetchRecords(currentRecordPage);
  }, [currentRecordPage]);

  const [filterOpen, setFilterOpen] = useState(false);
  const [filterCriteria, setFilterCriteria] = useState({
    patientName: '',
    date: '',
    type: '',
  });

  // Navigate to patient view page
  const handleOpenPatientView = (patientId) => {
    navigate(`/patient/${patientId}`);
  };

  // Calculate completion percentage for today's appointments from backend
  const totalAppointments = appointments.length;
  const completedAppointments = appointments.filter((a) => a.status === 'completed').length;
  const completionRate = totalAppointments > 0 ? Math.round((completedAppointments / totalAppointments) * 100) : 0;




  // Fetch patients from backend
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [patientsError, setPatientsError] = useState(null);
  const [currentPatientPage, setCurrentPatientPage] = useState(1);
  const [totalPatientPages, setTotalPatientPages] = useState(1);
  const [totalPatients, setTotalPatients] = useState(0);

  const fetchPatients = async (page = 1) => {
    setLoadingPatients(true);
    setPatientsError(null);
    try {
      const data = await getPatients(page);
      // Handle paginated response from API
      if (data && data.results && Array.isArray(data.results)) {
        setPatients(data.results);
        setTotalPatients(data.count || 0);
        setTotalPatientPages(Math.ceil((data.count || 0) / 10));
        console.log('API Pagination:', { 
          page, 
          count: data.count, 
          results: data.results.length,
          totalPages: Math.ceil((data.count || 0) / 10)
        });
      } else if (data && Array.isArray(data)) {
        // Fallback if API returns array directly
        setPatients(data);
        setTotalPatients(data.length);
        setTotalPatientPages(Math.ceil(data.length / 10));
      } else {
        // Fallback for unexpected data format
        setPatients([]);
        setTotalPatients(0);
        setTotalPatientPages(1);
        console.error('Unexpected data format:', data);
      }
    } catch (err) {
      setPatientsError('Failed to load patients');
      console.error('Error fetching patients:', err);
      toast({
        title: 'Error',
        description: 'Failed to load patients',
        variant: 'destructive',
      });
    } finally {
      setLoadingPatients(false);
    }
  };

  useEffect(() => {
    fetchPatients(currentPatientPage);
  }, [currentPatientPage]);

  const statusStyles = {
    completed: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    waiting: 'bg-amber-50 text-amber-700 border border-amber-200',
    'in-progress': 'bg-sky-50 text-sky-700 border border-sky-200',
    cancelled: 'bg-rose-50 text-rose-700 border border-rose-200',
  };

  return (
    <div className="max-w-[100%] mx-auto px-4 py-8">
      <div className="mb-8 border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-light tracking-tight text-slate-800 bg-mint-500">
          Doctor's dashboard
        </h1>
        <p className="text-slate-500 mt-1 text-sm">
          Welcome back, Dr. {user?.first_name} {user?.last_name}!
        </p>
      </div>

      {/* Statistics Cards */}
      {loadingStats ? (
        <div className="mb-8">Loading statistics...</div>
      ) : statsError ? (
        <div className="mb-8 text-red-500">{statsError}</div>
      ) : (
        <StatsSection stats={stats || {}} />
      )}


      <Tabs defaultValue="schedule" className="mb-8">
        <TabsHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        {/* Schedule */}
        <TabsContent value="schedule" className="mt-0">
          {loadingAppointments ? (
            <div className="p-4">Loading appointments...</div>
          ) : appointmentsError ? (
            <div className="p-4 text-red-500">{appointmentsError}</div>
          ) : (
            <ScheduleTable
              appointments={appointments}
              handleOpenPatientView={handleOpenPatientView}
              statusStyles={statusStyles}
              completionRate={completionRate}
            />
          )}
        </TabsContent>

        {/* Patients */}
        <TabsContent value="patients">
          <PatientsTab
            patients={patients}
            loading={loadingPatients}
            error={patientsError}

            onPageChange={(page) => {
              setCurrentPatientPage(page);
            }}
            currentPage={currentPatientPage}
            totalPages={totalPatientPages}
            totalItems={totalPatients}
          />
        </TabsContent>
        {/* Medical Records */}
        <TabsContent value="records">
          <MedicalRecordsList
            records={records}
            loading={loadingRecords}
            error={recordsError}
            totalRecords={totalRecords}
            currentPage={currentRecordPage}
            totalPages={totalRecordPages}
            onPageChange={(page) => setCurrentRecordPage(page)}
            handleOpenPatientView={handleOpenPatientView}
          />
        </TabsContent>
      </Tabs>

    </div>
  );
};

export default Dashboard;
