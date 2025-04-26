import {
  getCurrentCondition,
  getCurrentMedications,
  getPatientEmergencyContacts,
} from '@/utils/patient';
import { TabsContent } from '../../ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';

const Overview = ({ patient }) => {
  const emergencyContacts = getPatientEmergencyContacts(1);
  const currentCondition = getCurrentCondition(1);
  const currentMedications = getCurrentMedications(1);

  return (
    <TabsContent value="overview">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="space-y-4">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-y-2">
                <div className="text-sm font-medium">Age</div>
                <div className="text-sm">{patient.age} years</div>
                <div className="text-sm font-medium">Gender</div>
                <div className="text-sm">{patient.gender}</div>
                <div className="text-sm font-medium">Blood Type</div>
                <div className="text-sm">{patient.bloodType}</div>
                <div className="text-sm font-medium">Height</div>
                <div className="text-sm">{patient.height} cm</div>
                <div className="text-sm font-medium">Weight</div>
                <div className="text-sm">{patient.weight} kg</div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information  */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-y-2">
                <div className="text-sm font-medium">Phone</div>
                <div className="text-sm">{patient.phone}</div>
                <div className="text-sm font-medium">Email</div>
                <div className="text-sm">{patient.email}</div>
                <div className="text-sm font-medium">Address</div>
                <div className="text-sm">{patient.address}</div>
                <div className="text-sm font-medium">Emergency Contact</div>
                <div className="text-sm">
                  {emergencyContacts[0].name} - {emergencyContacts[0].relation} -{' '}
                  {emergencyContacts[0].phone}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {/* Current Condition */}
          <Card>
            <CardHeader>
              <CardTitle>Current Condition</CardTitle>
            </CardHeader>
            <CardContent>
              {currentCondition ? (
                <div className="space-y-1">
                  <div className="text-sm font-medium">Diagnosis</div>
                  <div className="text-sm">{currentCondition.diagnosis}</div>
                  <div className="text-sm font-medium">Description</div>
                  <div className="text-sm">{currentCondition.description}</div>
                  <div className="text-sm font-medium">Notes</div>
                  <div className="text-sm">{currentCondition.notes}</div>
                  <div className="text-sm font-medium">Record Date</div>
                  <div className="text-sm">{currentCondition.recordDate}</div>
                </div>
              ) : (
                <div className="text-sm">No current condition found.</div>
              )}
            </CardContent>
          </Card>

          {/* Current Medications */}
          <Card>
            <CardHeader>
              <CardTitle>Current Medications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {currentMedications?.length > 0 ? (
                  currentMedications.map((med, index) => (
                    <div key={index} className="space-y-1">
                      <div className="text-sm font-medium">{med.name}</div>
                      <div className="text-sm">Dosage: {med.dosage}</div>
                      <div className="text-sm">Frequency: {med.frequency}</div>
                      <div className="text-sm">Duration: {med.duration}</div>
                      <div className="text-sm">Instructions: {med.instructions}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm">No current medications found.</div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Insurance Information */}
          <Card>
            <CardHeader>
              <CardTitle>Insurance Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-y-2">
                <div className="text-sm font-medium">Provider</div>
                <div className="text-sm">{patient.insuranceProvider}</div>
                <div className="text-sm font-medium">Policy Number</div>
                <div className="text-sm">{patient.insuranceNumber}</div>
                <div className="text-sm font-medium">Expiry Date</div>
                <div className="text-sm">{patient.insuranceExpiryDate}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TabsContent>
  );
};

export default Overview;
