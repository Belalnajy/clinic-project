import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getStatistics,
  getTodayAppointments,
  getRecentPatientRecords
} from "../data/data";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "@/components/ui/table";

import { Filter, UserPlus, Users, ArrowsUpFromLine } from "lucide-react"; 
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import Papa from "papaparse";
import FilterDialog from "@/components/dashboard/FilterDialog";
import StatsSection from "@/components/dashboard/StatsSection";
import TabsHeader from "@/components/dashboard/TabsHeader";
import ScheduleTable from "@/components/dashboard/ScheduleTable";
import MedicalRecordsList from "@/components/dashboard/MedicalRecordsList";

const Dashboard = () => {
  const navigate = useNavigate();
  const stats = getStatistics("doctor");
  const todayAppointments = getTodayAppointments();
  const originalRecords = getRecentPatientRecords();
  const [searchTerm, setSearchTerm] = useState("");
  const [records, setRecords] = useState(originalRecords);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterCriteria, setFilterCriteria] = useState({
    patientName: "",
    date: "",
    type: ""
  });

  // Navigate to patient view page
  const handleOpenPatientView = patient => {
    navigate(`/patient/${patient.patientId}`);
  };

  const handleNewAppointment = () => {
    toast({
      title: "New Appointment",
      description: "Appointment has been scheduled successfully."
    });
  };

  // Calculate completion percentage for today
  const completedAppointments = todayAppointments.filter(
    a => a.status === "completed"
  ).length;
  const completionRate =
    Math.round(completedAppointments / todayAppointments.length * 100) || 0;

  // Filter appointments for search
  const filteredAppointments = todayAppointments.filter(appointment =>
    appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle Filter Button Click
  const handleFilter = () => {
    setFilterOpen(true);
  };

  // Apply Filters
  const applyFilters = () => {
    const filtered = originalRecords.filter(record => {
      const matchesName = record.patientName
        .toLowerCase()
        .includes(filterCriteria.patientName.toLowerCase());
      const matchesDate = filterCriteria.date
        ? record.date === filterCriteria.date
        : true;
      const matchesType = filterCriteria.type
        ? (record.type || "Consultation")
            .toLowerCase()
            .includes(filterCriteria.type.toLowerCase())
        : true;
      return matchesName && matchesDate && matchesType;
    });
    setRecords(filtered);
    setFilterOpen(false);
    toast({
      title: "Filters Applied",
      description: `Showing ${filtered.length} matching records.`
    });
  };

  // Reset Filters
  const resetFilters = () => {
    setFilterCriteria({ patientName: "", date: "", type: "" });
    setRecords(originalRecords);
    setFilterOpen(false);
    toast({
      title: "Filters Reset",
      description: "All records are now displayed."
    });
  };

  // Handle Export Button Click
  const handleExport = () => {
    const csvData = records.map(record => ({
      PatientName: record.patientName,
      PatientID: record.patientId,
      Date: record.date,
      Type: record.type || "Consultation",
      Diagnosis: record.diagnosis,
      Treatment: record.treatment,
      Prescription: record.prescription || "N/A",
      Notes: record.notes || "N/A",
      Physician: record.physician || "N/A"
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "medical_records.csv");
    link.click();
    URL.revokeObjectURL(url);
    toast({
      title: "Export Successful",
      description: "Medical records have been exported as CSV."
    });
  };

  const statusStyles = {
    completed: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    waiting: "bg-amber-50 text-amber-700 border border-amber-200",
    "in-progress": "bg-sky-50 text-sky-700 border border-sky-200",
    cancelled: "bg-rose-50 text-rose-700 border border-rose-200"
  };

  return (
    <div className="max-w-[100%] mx-auto px-4 py-8">
      <div className="mb-8 border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-light tracking-tight text-slate-800 bg-mint-500">
          Doctor's dashboard
        </h1>
        <p className="text-slate-500 mt-1 text-sm">
          Welcome back, Dr. Richardson
        </p>
      </div>

      {/* Statistics Cards */}
      <StatsSection
        stats={{
          patientsToday: "8",
          completedAppointments: `${completedAppointments}/${todayAppointments.length}`,
          completionRate,
          nextAppointment: "10:30 AM",
          pendingLabs: "3"
        }}
      />
      <Tabs defaultValue="schedule" className="mb-8">
        <TabsHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        {/* Schedule */}
        <TabsContent value="schedule" className="mt-0">
          <ScheduleTable
            appointments={filteredAppointments}
            handleOpenPatientView={handleOpenPatientView}
            statusStyles={statusStyles}
            handleNewAppointment={handleNewAppointment}
            completionRate={completionRate}
          />
        </TabsContent>

        {/* Patients */}
        <TabsContent value="patients">
          <div className="rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="border-b border-slate-100 bg-primary-300 py-7 px-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-white">
                  My Patient List
                </h2>
                <p className="text-slate-100 mt-1">
                  All active patients under your care
                </p>
              </div>
              <div className="flex  flex-wrap gap-3 ">
                <Button
                  size="sm"
                  className="border-slate-200 text-slate-800 bg-secondary hover:bg-slate-200">
                  <Filter size={16} className="mr-2 text-slate-800" />
                  Filter
                </Button>
                <Button
                  size="sm"
                  className="border-slate-200 text-slate-800 bg-secondary hover:bg-slate-200">
                  <ArrowsUpFromLine size={16} className="mr-2 text-slate-800" />
                  Sort
                </Button>
                <Button
                  size="sm"
                  className="border-slate-200 text-slate-800 bg-secondary hover:bg-slate-200"
                  onClick={() => console.log("New Patient Clicked")}>
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
                    <TableCell
                      colSpan={4}
                      className="text-center py-12 text-slate-500">
                      <Users
                        size={32}
                        className="mx-auto mb-3 text-slate-300"
                      />
                      Patient list content would appear here
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>
        {/* Medical Records */}
        <TabsContent value="records">
          <MedicalRecordsList
            records={records}
            originalRecords={originalRecords}
            handleOpenPatientView={handleOpenPatientView}
            handleFilter={handleFilter}
            handleExport={handleExport}
          />
        </TabsContent>
      </Tabs>
      {/* Filter */}
      <FilterDialog
        filterOpen={filterOpen}
        setFilterOpen={setFilterOpen}
        filterCriteria={filterCriteria}
        setFilterCriteria={setFilterCriteria}
        applyFilters={applyFilters}
        resetFilters={resetFilters}
      />
    </div>
  );
};

export default Dashboard;
