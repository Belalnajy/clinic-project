import { useState, useEffect } from 'react';
import { getAllAppointments, getAllPatients, getAllDoctors, getTodayAppointments, getRecentPatientRecords } from '../data/data';
import AppointmentModal from './modals/AppointmentModal';
import ScheduleTable from './dashboard/ScheduleTable';

const AppointmentTable = ({ onNewAppointment }) => {
  const todayAppointments = getTodayAppointments();
  const originalRecords = getRecentPatientRecords();
  const [searchTerm, setSearchTerm] = useState("");
  const [records, setRecords] = useState(originalRecords);
  const [filterOpen, setFilterOpen] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  useEffect(() => {
    // Load data from local storage
    setAppointments(getAllAppointments());
    setPatients(getAllPatients());
    setDoctors(getAllDoctors());
  }, []);
  
  // Get patient data by ID
  const getPatient = (patientId) => {
    return patients.find(p => p.id === patientId) || {};
  };
  
  // Get doctor data by ID
  const getDoctor = (doctorId) => {
    return doctors.find(d => d.id === doctorId) || {};
  };
  
  // Get status badge variant
  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'in-progress':
        return 'primary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };
  
  // Format status label
  const formatStatus = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ');
  };
  
  const openModal = () => {
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
  };
  
  const handleNewAppointment = (appointmentData) => {
    if (onNewAppointment) {
      onNewAppointment(appointmentData);
    }
    
    // Refresh appointments list
    setAppointments(getAllAppointments());
    closeModal();
  };

  // Filter appointments for search
  const filteredAppointments = todayAppointments.filter(appointment =>
    appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle Filter Button Click
  const handleFilter = () => {
    setFilterOpen(true);
  };
  // Calculate completion percentage for today
  const completedAppointments = todayAppointments.filter(
    a => a.status === "completed"
  ).length;
  const completionRate =
    Math.round(completedAppointments / todayAppointments.length * 100) || 0;

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
  const statusStyles = {
    completed: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    waiting: "bg-amber-50 text-amber-700 border border-amber-200",
    "in-progress": "bg-sky-50 text-sky-700 border border-sky-200",
    cancelled: "bg-rose-50 text-rose-700 border border-rose-200"
  };
  
  return (
    <>
  <ScheduleTable
            appointments={filteredAppointments}
            statusStyles={statusStyles}
            handleNewAppointment={handleNewAppointment}
            completionRate={completionRate}
          />
      
      <AppointmentModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        onSave={handleNewAppointment}
        patients={patients}
        doctors={doctors}
      />
    </>
  );
};

export default AppointmentTable;
