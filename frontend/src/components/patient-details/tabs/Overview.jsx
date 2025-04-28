import LoadingState from '@/components/LoadingState';
import CustomAlert from '@/components/CustomAlert';
import { useParams } from 'react-router-dom';
import { useMedicalRecords } from '@/hooks/useMedicalRecords';
import { usePrescriptions } from '@/hooks/usePrescriptions';
import { usePatient } from '@/hooks/usePatients';
import PersonalInfo from './overview-cards/PersonalInfo';
import ContactInfo from './overview-cards/ContactInfo';
import CurrentCondition from './overview-cards/CurrentCondition';
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
    return <LoadingState fullPage={true} message="Loading Patient Personal Info" />;
  }

  if (patientError || medRecError || prescriptionsError) {
    return <CustomAlert message="Couldn't get patient details" />;
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <div className="space-y-4">
        <PersonalInfo patient={patientData} />
        <ContactInfo patient={patientData} />
      </div>

      <div className="space-y-4">
        <CurrentCondition medicalRecord={medicalRecord} />
        <CurrentMedications currentMedications={medications} />
        <InsuranceInfo patient={patientData} />
      </div>
    </div>
  );
};

export default Overview;
