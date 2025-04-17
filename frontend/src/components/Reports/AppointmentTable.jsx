import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';

const AppointmentTable = ({ appointments }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const totalPages = Math.ceil(appointments.length / rowsPerPage);
  const paginatedAppointments = appointments.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Appointment ID</TableHead>
            <TableHead>Patient Name</TableHead>
            <TableHead>Provider</TableHead>
            <TableHead>Specialization</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedAppointments.map((appointment) => (
            <TableRow key={appointment.id}>
              <TableCell>{appointment.id}</TableCell>
              <TableCell>{appointment.patientName}</TableCell>
              <TableCell>{appointment.providerName}</TableCell>
              <TableCell>{appointment.specializationName}</TableCell>
              <TableCell>{appointment.status}</TableCell>
              <TableCell>{appointment.date}</TableCell>
              <TableCell>{appointment.time}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-between items-center mt-4">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="w-24"
        >
          Previous
        </Button>
        <span className="text-sm text-slate-500">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="w-24"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default AppointmentTable;
