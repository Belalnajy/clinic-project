import { useNavigate } from 'react-router-dom';

//**  ShadCN UI Components **//
import { Button } from '@/components/ui/button';
import PatientDetailsHeader from '@/components/patient-details/PatientDetailsHeader';
import { getPatientById } from '@/utils/patient';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CustomTabsList from '@/components/CustomTabsList';
import { tabsData } from './tabsData';
import OverviewTab from '@/components/patient-details/OverviewTab';
import MedicalRecordsTab from '@/components/patient-details/MedicalRecordsTab';

const PatientDetails = () => {
  const navigate = useNavigate();
  //! Replace with actual patient ID from route params or state
  const patientId = 1;
  const patient = getPatientById(patientId);
  const patientName = patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown Patient';

  if (!patient) {
    return (
      <>
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <h1 className="text-2xl font-semibold mb-2">Patient Not Found</h1>
          <p className="text-slate-500 mb-6">The requested patient could not be found.</p>
          <Button onClick={() => navigate('/')}>Return to Dashboard</Button>
        </div>
      </>
    );
  }
  return (
    <>
      {/* Patient Details Header */}
      <PatientDetailsHeader
        patientName={patientName}
        patientId={patient.patientId}
        city={patient.city}
      />

      {/* Patient Information Tabs */}
      <Tabs defaultValue="overview">
        <CustomTabsList tabsData={tabsData} />

        <OverviewTab patient={patient} />

        <MedicalRecordsTab patientId={patient.id} />

        <TabsContent value="prescriptions">
          <p>Prescriptions content goes here...</p>
        </TabsContent>

        <TabsContent value="lab-results">
          <p>Lab Results content goes here...</p>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default PatientDetails;
