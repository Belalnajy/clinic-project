import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/Auth/useAuth';
import { FileText} from 'lucide-react';
import CustomPagination from '@/components/CustomPagination';
import AppointmentModal from '@/components/modals/AppointmentModal';
import { useState } from 'react';
import useAppointments from '@/hooks/useAppointments';

const ScheduleTable = ({

  handleOpenPatientView,
  statusStyles,

}) => {
  const itemsPerPage = 10;
  const { user } = useAuth();
  const isSecretary = user.role === 'secretary';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Tracks if the modal is in edit mode
  const [editingAppointment, setEditingAppointment] = useState(null); // Stores the appointment being edited

  const {
    todayAppointments: appointments, isLoadingTodayAppointments,todayAppointmentsError, todayAppointmentsPagination ,
    completeAppointment,
    cancelAppointment,
    queueAppointment,
    isCancelling,
  } = useAppointments();

  const handleAppointmentStateChange = (appointmentId, status) => {
    if (status === 'scheduled') {
      queueAppointment(appointmentId);
    } else {
      completeAppointment(appointmentId);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(false); // Reset edit mode
    setEditingAppointment(null); // Clear editing data
  };


  if (isLoadingTodayAppointments) {
    return <h1>Loading...</h1>
  }

  if (todayAppointmentsError) {
    return <h1>Error loading appointments</h1>
  }

  return (
    <Card className="border-slate-200 p-0 shadow-sm overflow-hidden gap-0">
      <CardHeader className="border-b border-slate-100 py-4 sm:py-6 bg-primary-300">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <CardTitle className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
              Today's Appointments
            </CardTitle>
            <CardDescription className="text-slate-100 mt-1 text-sm sm:text-base">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left py-3 px-4 sm:py-4 sm:px-6 font-medium text-xs sm:text-sm text-slate-500">
                  Time
                </TableHead>
                <TableHead className="text-left py-3 px-4 sm:py-4 sm:px-6 font-medium text-xs sm:text-sm text-slate-500">
                  Patient
                </TableHead>
                {isSecretary && (
                  <TableHead className="text-left py-3 px-4 sm:py-4 sm:px-6 font-medium text-xs sm:text-sm text-slate-500 hidden sm:table-cell">
                    Doctor
                  </TableHead>
                )}

                <TableHead className="text-left py-3 px-4 sm:py-4 sm:px-6 font-medium text-xs sm:text-sm text-slate-500">
                  Status
                </TableHead>
                <TableHead className="text-left py-3 px-4 sm:py-4 sm:px-6 font-medium text-xs sm:text-sm text-slate-500">
                  Payment Status
                </TableHead>
                <TableHead className="text-right py-3 px-4 sm:py-4 sm:px-6 font-medium text-xs sm:text-sm text-slate-500">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {appointments.map((appointment, index) => (
                <TableRow
                  key={appointment.id || index}
                  className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                >
                  {/* Appointment Time */}
                  <TableCell className="py-3 px-4 sm:py-4 sm:px-6 text-slate-700 whitespace-nowrap">
                    {appointment.appointment_time}
                  </TableCell>
                  {/* Patient Info: Avatar, Name, ID */}
                  <TableCell className="py-3 px-4 sm:py-4 sm:px-6">
                    <div className="flex items-center min-w-[150px]">
                      <Avatar className="h-7 w-7 sm:h-8 sm:w-8 mr-2 sm:mr-3 border border-slate-200">
                        {/* Patient image if available, fallback to first letter */}
                        <AvatarImage
                          src={appointment.patient && appointment.patient.avatar}
                          alt={appointment.patient ? appointment.patient.first_name : ''}
                        />
                        <AvatarFallback className="bg-slate-100 text-slate-700">
                          {appointment.patient ? appointment.patient.first_name.charAt(0) : ''}
                        </AvatarFallback>
                      </Avatar>
                      <div className="truncate">
                        <div className="font-medium text-slate-800 truncate">
                          {/* Patient full name */}
                          {appointment.patient
                            ? `${appointment.patient.first_name} ${appointment.patient.last_name}`
                            : appointment.patient_name}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {isSecretary && (
                    <TableCell className="py-3 px-4 sm:py-4 sm:px-6 text-slate-700">
                      {appointment.doctor
                        ? `${appointment.doctor.first_name || ''} ${appointment.doctor.last_name || ''}`.trim()
                        : appointment.doctor_name || '—'}
                    </TableCell>
                  )}

                  {/* Status */}
                  <TableCell className="py-3 px-4 sm:py-4 sm:px-6">
                    <Badge
                      className={`font-normal px-2 py-0.5 sm:px-2 sm:py-1 text-xs sm:text-sm`}
                    >
                     { appointment.status}
                    </Badge>
                  </TableCell>

                  {/* Status */}
                  <TableCell className="py-3 px-4 sm:py-4 sm:px-6">
                    <Badge className={`font-normal px-2 py-0.5 sm:px-2 sm:py-1 text-xs sm:text-sm`}>
                      {appointment.payment?.status.toUpperCase()}
                    </Badge>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="py-3 px-4 sm:py-4 sm:px-6">
                    <div className="flex justify-end space-x-1 sm:space-x-2">
                      {isSecretary ? (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-secondary text-slate-700 hover:bg-slate-200 hover:cursor-pointer px-2 sm:px-3"
                            onClick={() => handleEditClick(appointment)}
                          >
                            <span className="hidden sm:inline ml-1 sm:ml-2">Edit</span>
                          </Button>
                          <Button
                            size="xs"
                            variant="destructive"
                            className="hover:cursor-pointer px-2 sm:px-3"
                            onClick={() => cancelAppointment(appointment.appointment_id)}
                          >
                            {isCancelling ? 'Canceling...' : 'cancel'}
                          </Button>
                          <Button
                            size="xs"
                            variant="default"
                            className="bg-primary-300 hover:bg-sky-700 hover:cursor-pointer px-2 sm:px-3"
                            onClick={() =>
                              handleAppointmentStateChange(
                                appointment.appointment_id,
                                appointment.status
                              )
                            }
                          >
                            <span className="hidden sm:inline ml-1 sm:ml-2 text-white">
                              {appointment.status === 'scheduled' ? 'Queue' : 'Complete'}
                            </span>
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-slate-600 hover:text-slate-900 hover:bg-blue-50 hover:cursor-pointer px-2 sm:px-3"
                            onClick={() => handleOpenPatientView(appointment.patient.id)}
                          >
                            <FileText size={14} className="sm:size-4" />
                            <span className="hidden sm:inline">View</span>
                          </Button>
                  
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>



      <AppointmentModal
        isOpen={isModalOpen}
        onClose={closeModal}
        isEditing={isEditing}
        appointmentId={editingAppointment?.appointment_id}
      />
      {/* Pagination */}
      <div className="flex justify-end bg-slate-50/50 p-4">
        <CustomPagination pagination={todayAppointmentsPagination} pageSize={itemsPerPage} />
      </div>
    </Card>
  );
};

export default ScheduleTable;
