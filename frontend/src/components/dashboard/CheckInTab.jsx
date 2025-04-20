import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

import { getTodayAppointments} from '@/data/data';

const CheckInTab = () => {
  const todayAppointments = getTodayAppointments();


  const upcomingAppointments = [...todayAppointments]
    .filter((a) => a.status === 'waiting')
    .sort((a, b) => {
      const timeA = a.time.replace('AM', ' AM').replace('PM', ' PM');
      const timeB = b.time.replace('AM', ' AM').replace('PM', ' PM');
      return new Date(`1/1/2024 ${timeA}`) - new Date(`1/1/2023 ${timeB}`);
    })
    .slice(0, 3);
  return (
    <Card className="border-slate-200 p-0  shadow-sm overflow-hidden">
      <CardHeader className="border-b border-slate-100 py-7">
        <CardTitle>Patient Check-in</CardTitle>
        <CardDescription>Manage arrivals and waiting patients</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {upcomingAppointments.map((appointment, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-4 border rounded-lg bg-white hover:bg-slate-50"
            >
              <div className="flex items-center">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src={appointment.patientAvatar} alt={appointment.patientName} />
                  <AvatarFallback>{appointment.patientName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{appointment.patientName}</div>
                  <div className="text-sm text-slate-500">
                    {appointment.time} - {appointment.reason}
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <Badge className="mr-4 bg-amber-100 text-amber-800">{appointment.status}</Badge>
                <Button>
                  <i className="fas fa-check-circle mr-2"></i> Check-in
                </Button>
              </div>
            </div>
          ))}

          {upcomingAppointments.length === 0 && (
            <div className="text-center p-8 text-slate-500">
              <i className="fas fa-check-circle text-3xl mb-2 text-green-500"></i>
              <p>No patients currently waiting</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t border-slate-100 py-4 px-6 bg-slate-50/50" >
        <div className="w-full">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Current wait time:</span>
            <span className="text-sm text-amber-600">~15 minutes</span>
          </div>
          <Progress value={45} className="h-2" />
        </div>
      </CardFooter>
    </Card>
  );
};

export default CheckInTab;
