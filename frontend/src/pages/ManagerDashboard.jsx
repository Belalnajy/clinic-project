import { useEffect, useState } from "react";
import { Activity, AlertCircle, Calendar, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/Auth/useAuth";
import DashboardHeader from "../components/managerdashboard/DashboardHeader";
import StatisticsCards from "../components/managerdashboard/StatisticsCards";
import FinanceSection from "../components/managerdashboard/FinanceSection";
import StaffSection from "../components/managerdashboard/StaffSection";
import PatientsSection from "../components/managerdashboard/PatientsSection";
import ClinicPerformance from "@/components/ClinicPerformance";
import AppointmentTable from "../components/AppointmentTable";
// import AIAssistant from '../components/AIAssistant';
import {
  getStatistics,
  getStaffPerformance,
  getRecentRegistrations,
  getRevenueData
} from "../data/data";

const ManagerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [staffPerformance, setStaffPerformance] = useState(null);
  const [recentRegistrations, setRecentRegistrations] = useState(null);
  const [revenueData, setRevenueData] = useState(null);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [
          statsData,
          staffData,
          registrationsData,
          revenue
        ] = await Promise.all([
          getStatistics("manager"),
          getStaffPerformance(),
          getRecentRegistrations(),
          getRevenueData()
        ]);
        setStats(statsData);
        setStaffPerformance(staffData);
        setRecentRegistrations(registrationsData);
        setRevenueData(revenue);
      } catch (err) {
        console.error("Dashboard data fetch error:", err);
        setError("Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleNewAppointment = appointmentData => {
    console.log("New appointment:", appointmentData);
  };

  const handleNewPatient = patientData => {
    console.log("New patient:", patientData);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <h2 className="text-xl font-semibold text-gray-700">
          Loading dashboard data...
        </h2>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Unable to load dashboard
        </h2>
        <p className="text-gray-600">
          {error}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <DashboardHeader userName={user.name} />
      <Tabs
        defaultValue="overview"
        className="mb-6"
        onValueChange={setSelectedTab}>
        <TabsList className="grid grid-cols-4 w-ful max-w-md mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="finance">Finance</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <StatisticsCards stats={stats} />
          <div className="mb-7">
            <ClinicPerformance />
          </div>
          <AppointmentTable onNewAppointment={handleNewAppointment} />
        </TabsContent>

        <TabsContent value="finance">
          <FinanceSection revenueData={revenueData} />
        </TabsContent>

        <TabsContent value="staff">
          <StaffSection staffPerformance={staffPerformance} />
        </TabsContent>

        <TabsContent value="patients">
          <PatientsSection
            stats={stats}
            recentRegistrations={recentRegistrations}
            onNewPatient={handleNewPatient}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManagerDashboard;
