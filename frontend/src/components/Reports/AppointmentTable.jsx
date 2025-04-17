import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const AppointmentTable = ({ appointments }) => {
  return (
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
        {appointments.map((appointment) => (
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
  );
};

export default AppointmentTable;
