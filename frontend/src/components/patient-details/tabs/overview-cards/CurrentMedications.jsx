import CustomAlert from '@/components/CustomAlert';
import LoadingState from '@/components/LoadingState';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePrescriptions } from '@/hooks/usePrescriptions';

const CurrentMedications = () => {
  const { prescriptionsData, isLoadingPrescriptions, prescriptionsError } = usePrescriptions();
  const currentMedications = prescriptionsData[0]?.medications;

  if (isLoadingPrescriptions) {
    return <LoadingState fullPage={true} message="Loading Patient Personal Info" />;
  }

  if (prescriptionsError) {
    return <CustomAlert message="Couldn't get patient details" />;
  }

  if (!currentMedications.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Current Medications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm">No current medications found.</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Medications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {currentMedications.map((med, index) => (
            <div key={index} className="space-y-1">
              <div className="text-sm font-medium">{med.medication.name}</div>
              <div className="text-sm">Dosage: {med.dosage}</div>
              <div className="text-sm">Frequency: {med.frequency}</div>
              <div className="text-sm">Duration: {med.duration}</div>
              <div className="text-sm">Instructions: {med.instructions}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentMedications;
