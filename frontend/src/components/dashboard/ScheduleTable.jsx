import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";


const ScheduleTable = ({ appointments, handleOpenPatientView, statusStyles, handleNewAppointment, completionRate }) => {
  return (
    <Card className="border-slate-200 p-0 shadow-sm overflow-hidden">
      <CardHeader className="border-b border-slate-100 py-7 bg-primary-300">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-semibold tracking-tight text-white">
              Today's Appointments
            </CardTitle>
            <CardDescription className="text-slate-100 mt-1">
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </CardDescription>
          </div>
          <Button
            size="sm"
            className="border-slate-200 bg-secondary text-slate-800 hover:bg-slate-200 hover:cursor-pointer"
            onClick={handleNewAppointment}
          >
            <IconCalendarPlus size={16} className="mr-2 text-slate-800" />
            Add Appointment
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left py-4 px-6 font-medium text-sm text-slate-500">Time</TableHead>
                <TableHead className="text-left py-4 px-6 font-medium text-sm text-slate-500">Patient</TableHead>
                <TableHead className="text-left py-4 px-6 font-medium text-sm text-slate-500">Reason</TableHead>
                <TableHead className="text-left py-4 px-6 font-medium text-sm text-slate-500">Status</TableHead>
                <TableHead className="text-right py-4 px-18 font-medium text-sm text-slate-500">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appointment, index) => (
                <TableRow key={index} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <TableCell className="py-4 px-6 text-slate-700">{appointment.time}</TableCell>
                  <TableCell className="py-4 px-6">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-3 border border-slate-200">
                        <AvatarImage src={appointment.patientAvatar} alt={appointment.patientName} />
                        <AvatarFallback className="bg-slate-100 text-slate-700">
                          {appointment.patientName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-slate-800">{appointment.patientName}</div>
                        <div className="text-xs text-slate-500">{appointment.patientId}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-6 text-slate-600">{appointment.reason}</TableCell>
                  <TableCell className="py-4 px-6">
                    <Badge className={`font-normal px-2 py-1 ${statusStyles[appointment.status]}`}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <div className="flex justify-end space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-slate-600 hover:text-slate-900 hover:bg-blue-50 hover:cursor-pointer"
                        onClick={() => handleOpenPatientView(appointment)}
                      >
                        <IconFileReport size={16} className="" /> View
                      </Button>
                      <Button
                        size="sm"
                        variant={appointment.status === "waiting" ? "default" : "secondary"}
                        className={
                          appointment.status === "waiting"
                            ? "bg-primary-300 hover:bg-sky-700 hover:cursor-pointer"
                            : "bg-secondary text-slate-700 hover:bg-slate-200 hover:cursor-pointer"
                        }
                      >
                        {appointment.status === "waiting" ? (
                          <>
                            <IconPlayerPlay color="white" className="" />
                            <span className="ml-3.5 text-white">Start</span>
                          </>
                        ) : (
                          <>
                            <IconPencil stroke={2} className="" />
                            <span className="">Update</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between border-t border-slate-100 py-4 px-6 bg-slate-50/50">
        <div className="flex items-center">
          <span className="text-sm font-medium text-slate-600 mr-2">Daily Progress</span>
          <div className="w-48 bg-slate-200 rounded-full h-2 mr-2">
            <div
              className="bg-gradient-to-r from-sky-500 to-blue-600 h-2 rounded-full"
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
          <span className="text-sm text-slate-600">{completionRate}%</span>
        </div>
        <Button variant="outline" size="sm" className="border-slate-200 hover:cursor-pointer">
          <IconDownload size={16} className="mr-2 text-slate-500" />
          Export Schedule
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ScheduleTable;
