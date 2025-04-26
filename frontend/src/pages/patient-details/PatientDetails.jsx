import { Outlet, useNavigate } from 'react-router-dom';
import { tabsData } from './tabsData';
import { getPatientById } from '@/utils/patient';
//**  ShadCN UI Components **//
import { Button } from '@/components/ui/button';
import { Tabs } from '@/components/ui/tabs';
// ** Custom Components **//
import CustomTabsList from '@/components/CustomTabsList';
import PatientDetailsHeader from '@/components/patient-details/PatientDetailsHeader';
import {
  LabResults,
  MedicalRecords,
  Overview,
  Prescriptions,
} from '@/components/patient-details/tabs';
import QuickActions from '@/components/patient-details/quick-actions/QuickActions';
import CustomPageTabs from '@/components/CustomPageTabs';

const PatientDetails = () => {
  const navigate = useNavigate();
  //! Replace with actual patient ID from route params or state
  const patientId = 1;
  const patient = getPatientById(patientId);
  const patientName = patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown Patient';
  const tabsData = ['overview', 'medical-records', 'prescriptions', 'lab-results'];

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

      {/* Quick Actions */}
      <QuickActions />

      <CustomPageTabs tabs={tabsData} />
      <Outlet />
      {/* Patient Information Tabs */}
      {/* <Tabs defaultValue="overview"> */}
      {/* Tabs List */}
      {/* <CustomTabsList tabsData={tabsData} /> */}

      {/* Tabs Content */}
      {/* <Overview patient={patient} />
        <MedicalRecords />
        <Prescriptions patientId={patient.id} />
        <LabResults patientId={patient.id} />
      </Tabs> */}
    </>
  );
};

export default PatientDetails;
