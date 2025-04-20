import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CircleCheckBig } from "lucide-react";
import { getTodayAppointments } from "@/data/data";

const CheckInTab = () => {
  const todayAppointments = getTodayAppointments();

  const upcomingAppointments = [...todayAppointments]
    .filter(a => a.status === "waiting")
    .sort((a, b) => {
      const timeA = a.time.replace("AM", " AM").replace("PM", " PM");
      const timeB = b.time.replace("AM", " AM").replace("PM", " PM");
      return new Date(`1/1/2024 ${timeA}`) - new Date(`1/1/2023 ${timeB}`);
    })
    .slice(0, 3);

  return (
    <Card className="border-slate-200 p-0 shadow-sm overflow-hidden">
      <CardHeader className="border-b border-slate-100 py-4 md:py-7">
        <CardTitle className="text-lg md:text-xl">Patient Check-in</CardTitle>
        <CardDescription className="text-sm md:text-base">
          Manage arrivals and waiting patients
        </CardDescription>
      </CardHeader>
      <CardContent className="p-2 sm:p-4">
        <div className="space-y-3 sm:space-y-4">
          {upcomingAppointments.map((appointment, index) =>
            <div
              key={index}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 border rounded-lg bg-white hover:bg-slate-50 gap-3">
              <div className="flex items-center w-full sm:w-auto">
                <Avatar className="h-8 w-8 sm:h-10 sm:w-10 mr-2 sm:mr-3">
                  <AvatarImage
                    src={appointment.patientAvatar}
                    alt={appointment.patientName}
                  />
                  <AvatarFallback>
                    {appointment.patientName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm sm:text-base truncate">
                    {appointment.patientName}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-500 truncate">
                    {appointment.time} - {appointment.reason}
                  </div>
                </div>
              </div>
              <div className="flex items-center w-full sm:w-auto justify-end sm:justify-normal gap-2">
                <Badge className="text-xs sm:text-sm bg-amber-100 text-amber-800">
                  {appointment.status}
                </Badge>
                <Button size="sm" className="text-xs sm:text-sm">
                  <CircleCheckBig />
                  Check-in
                </Button>
              </div>
            </div>
          )}

          {upcomingAppointments.length === 0 &&
            <div className="text-center p-4 sm:p-8 text-slate-500">
              <i className="fas fa-check-circle text-2xl sm:text-3xl mb-2 text-green-500" />
              <p className="text-sm sm:text-base">
                No patients currently waiting
              </p>
            </div>}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t border-slate-100 py-3 px-4 sm:py-4 sm:px-6 bg-slate-50/50">
        <div className="w-full">
          <div className="flex justify-between items-center mb-1 sm:mb-2">
            <span className="text-xs sm:text-sm font-medium">
              Current wait time:
            </span>
            <span className="text-xs sm:text-sm text-amber-600">
              ~15 minutes
            </span>
          </div>
          <Progress value={45} className="h-1 sm:h-2" />
        </div>
      </CardFooter>
    </Card>
  );
};

export default CheckInTab;
