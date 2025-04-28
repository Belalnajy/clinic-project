import { getCurrentCondition, getCurrentMedications } from '@/utils/patient';
import { TabsContent } from '../../ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import useAppointments from '@/hooks/useAppointments';
import LoadingState from '@/components/LoadingState';
import CustomAlert from '@/components/CustomAlert';

const Overview = ({ appointment }) => {
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
                <div className="text-sm font-medium">Specialization</div>
                <div className="text-sm">{appointment.doctor.specialization}</div>
                <div className="text-sm font-medium">Appointment Date</div>
                <div className="text-sm">{appointment.appointment_date}</div>
                <div className="text-sm font-medium">Appointment Time</div>
                <div className="text-sm">{appointment.appointment_time}</div>
                <div className="text-sm font-medium">Status</div>
                <div className="text-sm">{appointment.status}</div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-y-2">
                <div className="text-sm font-medium">Notes</div>
                <div className="text-sm">{appointment.notes}</div>
                <div className="text-sm font-medium">Created By</div>
                <div className="text-sm">{appointment.created_by_name}</div>
                <div className="text-sm font-medium">Created at</div>
                <div className="text-sm">
                  {appointment.created_at.slice(0, 10)} - {appointment.created_at.slice(11, 19)}
                </div>
                <div className="text-sm font-medium">Updated at</div>
                <div className="text-sm">
                  {appointment.updated_at.slice(0, 10)} - {appointment.updated_at.slice(11, 19)}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TabsContent>
  );
};

export default Overview;
