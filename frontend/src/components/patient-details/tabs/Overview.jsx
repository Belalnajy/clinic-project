import { usePatient } from '@/hooks/usePatients';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import PersonalInfo from './overview-cards/PersonalInfo';
import LoadingState from '@/components/LoadingState';
import CustomAlert from '@/components/CustomAlert';
import ContactInfo from './overview-cards/ContactInfo';
import { useMedicalRecords } from '@/hooks/useMedicalRecords';
import { useParams } from 'react-router-dom';
import CurrentCondition from './overview-cards/CurrentCondition';
import { usePrescriptions } from '@/hooks/usePrescriptions';
import CurrentMedications from './overview-cards/CurrentMedications';
import InsuranceInfo from './overview-cards/InsuranceInfo';

const Overview = () => {
  const { id: patientId } = useParams();
  const { data: patientData, isLoading: patientLoading, isError: patientError } = usePatient();
  const { useLatestMedicalRecord } = useMedicalRecords();
  const {
    data: medicalRecord,
    isLoading: medRecLoading,
    isError: medRecError,
  } = useLatestMedicalRecord(patientId);
  const { prescriptionsData, isLoadingPrescriptions, prescriptionsError } = usePrescriptions();
  const medications = prescriptionsData[0]?.medications;

  const currentMedications = [];

  if (patientLoading || medRecLoading || isLoadingPrescriptions) {
    return <LoadingState fullPage="true" message="Loading Patient Personal Info" />;
  }

  if (patientError || medRecError || prescriptionsError) {
    return <CustomAlert message="Couldn't get patient details" />;
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <div className="space-y-4">
        {/* Personal Information */}
        <PersonalInfo patient={patientData} />

        {/* Contact Information  */}
        <ContactInfo patient={patientData} />
      </div>

      <div className="space-y-4">
        {/* Current Condition */}
        <CurrentCondition medicalRecord={medicalRecord} />
        {/* Current Medications */}
        <CurrentMedications currentMedications={medications} />

        {/* Insurance Information */}
        <InsuranceInfo patient={patientData} />
      </div>
    </div>
  );
};

export default Overview;
