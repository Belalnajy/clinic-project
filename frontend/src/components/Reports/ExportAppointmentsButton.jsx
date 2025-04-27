import React from 'react';
import { Button } from '@/components/ui/button';
import { FileArchive } from 'lucide-react';
import Papa from 'papaparse';

const ExportAppointmentsButton = ({ appointmentsData }) => {
  const handleExportData = () => {
    if (!appointmentsData || !appointmentsData.results) return;
    const csvData = appointmentsData.results.map((appointment) => ({
      'Appointment ID': appointment.appointment_id,
      'Patient Name': `${appointment.patient.first_name} ${appointment.patient.last_name}`,
      Doctor: `${appointment.doctor.first_name} ${appointment.doctor.last_name}`,
      Specialization: appointment.doctor.specialization,
      Status: appointment.status,
      Date: appointment.appointment_date,
      Time: appointment.appointment_time,
    }));
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'appointments_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Button
      size="lg"
      className="border-slate-200 bg-secondary text-slate-800 hover:bg-slate-200 hover:cursor-pointer"
      onClick={handleExportData}
      disabled={
        !appointmentsData || !appointmentsData.results || appointmentsData.results.length === 0
      }
    >
      <FileArchive size={16} className="mr-2 text-slate-800" />
      Export
    </Button>
  );
};

export default ExportAppointmentsButton;
