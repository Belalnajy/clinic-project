import React from 'react';
import { useParams } from 'react-router-dom';
import useAppointments from '@/hooks/useAppointments';
import { Link } from 'react-router-dom';
import { Tabs } from '@/components/ui/tabs';
import CustomTabsList from '@/components/CustomTabsList';
import { tabsData } from './appointment-details/tabsData';
import Overview from '@/components/appointment-details/tabs/Overview';
import { Button } from '@/components/ui/button';

const AppointmentDetails = () => {
  const { appointmentId } = useParams(); // Extract the appointmentId from the URL
  const { useAppointment } = useAppointments(); // Access the custom hook
  const { data: appointment, isLoading, error } = useAppointment(appointmentId); // Fetch the appointment data

  if (isLoading) {
    return <div>Loading appointment details...</div>;
  }

  if (error) {
    return <div>Error fetching appointment details: {error.message}</div>;
  }

  if (!appointment) {
    return <div>Appointment not found.</div>;
  }

  return (
    <div className="p-6">
      <div>
        <Link to="/" className="text-sm text-blue-600 hover:text-blue-800 flex items-center mb-2">
          <i className="fas fa-arrow-left mr-1"></i> Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Appointment Information</h1>
        <p className="text-slate-500">Viewing appointment for {appointment.patient_name}</p>

        <div className=" my-6 p-6 bg-white rounded-lg border">
         <div className="flex items-center justify-between mb-4">
         <h2 className="text-2xl mb-2 font-bold">{appointment.patient_name}</h2>
         <Link to={`/patient/${appointment.patient.id}`} className="text-sm text-blue-600 hover:text-blue-800 flex items-center mb-2">
         <Button
              className="bg-primary hover:bg-primary/90 transition-colors"
            >
              View Patient Details
            </Button>
        </Link>
          
         </div>
          <p className="text-slate-500 text-sm">Patient ID: {appointment.patient.id}</p>
          <p className="text-slate-500 text-sm">Patient UUID: {appointment.patient.patient_id}</p>
          <p className="text-slate-500 text-sm">City: {appointment.patient.city}</p>
        </div>
      </div>
      <h1 className="text-2xl font-bold mb-4">Appointment Details</h1>
      
      <Tabs defaultValue="overview">
        {/* Tabs List */}
        <CustomTabsList tabsData={tabsData} />

        {/* Tabs Content */}
        <Overview appointmentId={appointment.appointment_id} />
      </Tabs>
    </div>
  );
};

export default AppointmentDetails;
