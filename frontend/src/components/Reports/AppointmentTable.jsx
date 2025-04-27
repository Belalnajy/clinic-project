import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useSearchParams } from 'react-router-dom';

const AppointmentTable = ({ appointments }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  const totalPages = Math.ceil(appointments.count / 8); // 8 is our page_size

  const handlePrevious = () => {
    if (currentPage > 1) {
      setSearchParams((prev) => {
        prev.set('page', currentPage - 1);
        return prev;
      });
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setSearchParams((prev) => {
        prev.set('page', currentPage + 1);
        return prev;
      });
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Appointment ID</TableHead>
            <TableHead>Patient Name</TableHead>
            <TableHead>Doctor</TableHead>
            <TableHead>Specialization</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.results?.map((appointment) => (
            <TableRow key={appointment.appointment_id}>
              <TableCell>{appointment.appointment_id}</TableCell>
              <TableCell>{`${appointment.patient.first_name} ${appointment.patient.last_name}`}</TableCell>
              <TableCell>{`${appointment.doctor.first_name} ${appointment.doctor.last_name}`}</TableCell>
              <TableCell>{appointment.doctor.specialization}</TableCell>
              <TableCell>{appointment.status}</TableCell>
              <TableCell>{appointment.appointment_date}</TableCell>
              <TableCell>{appointment.appointment_time}</TableCell>
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
