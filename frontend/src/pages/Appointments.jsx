import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { getAllAppointments, getAllDoctors, getAllPatients } from '../data/data';

import { Plus, Search, Eye, Edit, Trash, User } from 'lucide-react';
import AppointmentModal from '@/components/modals/AppointmentModal';
import { useNavigate } from 'react-router-dom';
import useAppointments from '@/hooks/useAppointments';
import { usePatients } from '@/hooks/usePatients';
import { useDoctors } from '@/hooks/useDoctors';
import LoadingState from '@/components/LoadingState';
import CustomPagination from '@/components/CustomPagination';

const Appointments = () => {
  const navigate = useNavigate();
  const { appointments, pagination, isLoadingAppointments, appointmentsError, deleteAppointment } = useAppointments();
  
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appointmentStatusFilter, setAppointmentStatusFilter] = useState('all');
  // const [patients, setPatients] = useState([]);
  // const [doctors, setDoctors] = useState([]);
  let today = new Date().toLocaleDateString();
  const [date, setDate] = useState(today);

  useEffect(() => {
    setFilteredAppointments(appointments);
    // console.log(filteredAppointments)
    // console.log(appointments)
  }, [appointments]);

  useEffect(() => {
    if (searchTerm.trim() === '' && appointmentStatusFilter === 'all' && date === today) {
      setFilteredAppointments(appointments);
    } else {

      const filtered = appointments
        .filter(
          (appointment) =>
            // appointment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            appointment.doctor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            appointment.patient_name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter((appointment) => {
          if (appointmentStatusFilter === 'all') {
            return true;
          }
          return appointment.status.toLowerCase() === appointmentStatusFilter.toLowerCase();
        })
        .filter((appointment) => {
          if (date === today) {
            return true;
          }
          return appointment.date === format(date, 'yyyy-MM-dd')
        });
      setFilteredAppointments(filtered);
    }
  }, [searchTerm, appointments, appointmentStatusFilter, date]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleNewAppointment = (appointmentData) => {
    // setAppointments(getAllAppointments());
    closeModal();
  };

  if(isLoadingAppointments) {
    return <LoadingState fullPage={true} message="Loading appointments..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Appointments</h1>
        <p>Manage appointments information</p>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="pb-3 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                <Search size={18} />
              </div>
              <Input
                type="search"
                placeholder="Search by patient name, doctor name, or appointment ID..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10"
              />
            </div>
            <Popover modal={true} onValueChange={setDate}>
              <PopoverTrigger >
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-[280px] justify-start text-left font-normal',
                    !date && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'P') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" style={{ pointerEvents: "auto" }}>
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
              </PopoverContent>
            </Popover>
            <Select onValueChange={setAppointmentStatusFilter}>
              <SelectTrigger className="h-9 w-auto text-sm  border-gray-200">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Scheduled">Scheduled</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="In-Queue">In-Queue</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Button
                onClick={openModal}
              className="bg-primary hover:bg-primary/90 transition-colors"
            >
              <Plus size={18} className="mr-2" />
              Add Appointment
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full caption-bottom text-sm">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="h-12 px-6 text-left align-middle font-medium text-slate-500">
                    Patient
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-slate-500">
                    Date
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-slate-500">
                    Time
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-slate-500">
                    Doctor
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-slate-500">
                    Status
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-slate-500">
                    Notes
                  </th>
                  <th className="h-12 px-4 text-center align-middle font-medium text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map((appointment) => (
                    <tr key={appointment.id} className="transition-colors hover:bg-slate-50">
                      <td className="p-4 pl-6 align-middle">
                        <div className="flex items-center gap-3">
                          <div>
                            <div className="font-medium text-slate-900">
                              {appointment.patient_name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 align-middle">{appointment.appointment_date}</td>
                      <td className="p-4 align-middle">{appointment.appointment_time}</td>
                      <td className="p-4 align-middle">{appointment.doctor_name}</td>
                      <td className="p-4 align-middle">{appointment.status}</td>
                      <td className="p-4 align-middle font-medium">{appointment.notes}</td>
                      <td className="p-4 align-middle">
                        <div className="flex justify-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-slate-600 hover:text-primary hover:bg-primary/10"
                            aria-label="View Patient"
                          >
                            <Eye size={18} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                            aria-label="Edit Patient"
                          >
                            <Edit size={18} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-slate-600 hover:text-red-600 hover:bg-red-50"
                            aria-label="Delete Patient"
                            onClick = {deleteAppointment.bind(this, appointment.appointment_id)}
                          >
                            <Trash size={18} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-6 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center py-6">
                        <User size={36} className="text-slate-300 mb-2" />
                        <p className="text-slate-500 mb-1">
                          {searchTerm ? 'No patients match your search' : 'No patients found'}
                        </p>
                        {!searchTerm && (
                          <Button variant="outline" size="sm" onClick={openModal} className="mt-2">
                            <Plus size={16} className="mr-2" />
                            Add your first appointment
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* <AppointmentModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        onSave={handleNewAppointment}
        patients={patients}
        doctors={doctors}
      /> */}
      <div className="mt-6">
        <CustomPagination
          totalItems={pagination.count}
          currentPage={pagination.currentPage}
          onPageChange={(page) => {
            navigate(`/appointments?page=${page}`);
          }}
          hasNextPage={!!pagination.next}
          hasPreviousPage={!!pagination.previous}
        />
      </div>
    </div>
    
  );
};

export default Appointments;
