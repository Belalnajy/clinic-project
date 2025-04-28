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
import {  FileText, PlayCircle, Edit, CheckCircle } from 'lucide-react';
import CustomPagination from '@/components/CustomPagination';

const ScheduleTable = ({
  appointments,
  handleOpenPatientView,
  statusStyles,
  completionRate,
  totalItems = 0,
}) => {
  const itemsPerPage = 10;
  const { user } = useAuth();
  const isSecretary = user.role === 'secretary';

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
                  Reason
                </TableHead>

                <TableHead className="text-left py-3 px-4 sm:py-4 sm:px-6 font-medium text-xs sm:text-sm text-slate-500">
                  Status   
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
                        <div className="text-xs text-slate-500 truncate">
                          {/* Patient UUID */}
                          {appointment.patient
                            ? appointment.patient.patient_id
                            : ''}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  {isSecretary && (
                    <TableCell className="py-3 px-4 sm:py-4 sm:px-6 text-slate-700">
                      {appointment.doctor
                        ? `Dr. ${appointment.doctor.first_name || ''} ${appointment.doctor.last_name || ''}`.trim()
                        : appointment.doctor_name || '—'}
                    </TableCell>
                  )}
                  {/* Reason/Notes */}
                  <TableCell className="py-3 px-4 sm:py-4 sm:px-6 text-slate-600 hidden sm:table-cell">
                    {appointment.notes || appointment.reason}
                  </TableCell>
                  {/* Status */}
                  <TableCell className="py-3 px-4 sm:py-4 sm:px-6">
                    <Badge
                      className={`font-normal px-2 py-0.5 sm:px-2 sm:py-1 text-xs sm:text-sm ${
                        statusStyles[appointment.status]
                      }`}
                    >
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </Badge>
                  </TableCell>
                  {/* Actions */}
                  <TableCell className="py-3 px-4 sm:py-4 sm:px-6">
                    <div className="flex justify-end space-x-1 sm:space-x-2">
                      {isSecretary ? (
                        <>
                          <Button
                            size="sm"
                            variant="secondary"
                            className="bg-secondary text-slate-700 hover:bg-slate-200 hover:cursor-pointer px-2 sm:px-3"
                          >
                            <Edit size={14} className="sm:size-4" />
                            <span className="hidden sm:inline ml-1 sm:ml-2">Edit</span>
                          </Button>
                          <Button
                            size="xs"
                            variant="default"
                            className="bg-primary-300 hover:bg-sky-700 hover:cursor-pointer px-2 sm:px-3"
                          >
                            <CheckCircle size={14} className="text-white sm:size-4" />
                            <span className="hidden sm:inline ml-1 sm:ml-2 text-white">
                              Check-in
                            </span>
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-slate-600 hover:text-slate-900 hover:bg-blue-50 hover:cursor-pointer px-2 sm:px-3"
                            onClick={() => handleOpenPatientView(appointment)}
                          >
                            <FileText size={14} className="sm:size-4" />
                            <span className="hidden sm:inline">View</span>
                          </Button>
                          <Button
                            size="xs"
                            variant={appointment.status === 'waiting' ? 'default' : 'secondary'}
                            className={
                              appointment.status === 'waiting'
                                ? 'bg-primary-300 hover:bg-sky-700 hover:cursor-pointer px-2 sm:px-3'
                                : 'bg-secondary text-slate-700 hover:bg-slate-200 hover:cursor-pointer px-2 sm:px-3'
                            }
                          >
                            {appointment.status === 'waiting' ? (
                              <>
                                <PlayCircle size={14} color="white" className="sm:size-4" />
                                <span className="hidden sm:inline ml-1 sm:ml-2 text-white">
                                  Start
                                </span>
                              </>
                            ) : (
                              <>

                                <Edit size={14} className="sm:size-4"  />
                                <span className="hidden sm:inline">Update</span>
                              </>
                            )}
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

      <CardFooter className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-t border-slate-100 py-3 px-4 sm:py-4 sm:px-6 bg-slate-50/50">
        <div className="flex items-center w-full sm:w-auto">
          <span className="text-xs sm:text-sm font-medium text-slate-600 mr-2 whitespace-nowrap">
            Daily Progress
          </span>
          <div className="w-24 sm:w-48 bg-slate-200 rounded-full h-1.5 sm:h-2 mr-2">
            <div
              className="bg-gradient-to-r from-sky-500 to-blue-600 h-1.5 sm:h-2 rounded-full"
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
          <span className="text-xs sm:text-sm text-slate-600 whitespace-nowrap">
            {completionRate}%
          </span>
        </div>

      </CardFooter>
      {/* Pagination */}
      <div className="flex justify-end bg-slate-50/50 p-4">
        <CustomPagination
          pagination={{ count: totalItems }}
          pageSize={itemsPerPage}
        />
      </div>
    </Card>
  );
};

export default ScheduleTable;
