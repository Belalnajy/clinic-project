import { getCurrentCondition, getCurrentMedications } from '@/utils/patient';
import { TabsContent } from '../../ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import  useAppointments  from '@/hooks/useAppointments';

const Overview = ({ appointmentId }) => {
  const { useAppointment, cancelAppointment, completeAppointment } = useAppointments();
    const { data: appointment } = useAppointment(appointmentId);

  return (
    <TabsContent value="overview">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Appointment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-y-2">
                <div className="text-sm font-medium">Appointment ID</div>
                <div className="text-sm">{appointment.appointment_id}</div>
                <div className="text-sm font-medium">Patient Name</div>
                <div className="text-sm">{appointment.patient_name}</div>
                <div className="text-sm font-medium">Doctor Name</div>
                <div className="text-sm">{appointment.doctor_name}</div>
                <div className="text-sm font-medium">Appointment Date</div>
                <div className="text-sm">{appointment.appointment_date}</div>
                <div className="text-sm font-medium">Appointment Time</div>
                <div className="text-sm">{appointment.appointment_time}</div>
                <div className="text-sm font-medium">Status</div>
                <div className="text-sm">{appointment.status}</div>
              </div>
            </CardContent>
          </Card>
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-y-2"></div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {/* Current Condition */}
          <Card>
            <CardHeader>
              <CardTitle>Current Condition</CardTitle>
            </CardHeader>
            <CardContent></CardContent>
          </Card>

          {/* Current Medications */}
          <Card>
            <CardHeader>
              <CardTitle>Current Medications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2"></div>
            </CardContent>
          </Card>

          {/* Insurance Information */}
          {/* <Card>
              <CardHeader>
                <CardTitle>Insurance Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-y-2">
                  
                </div>
              </CardContent>
            </Card> */}
        </div>
      </div>
    </TabsContent>
  );
};

export default Overview;
