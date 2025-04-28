import { Outlet, useNavigate } from 'react-router-dom';
import { getPatientById } from '@/utils/patient';
//**  ShadCN UI Components **//
import { Button } from '@/components/ui/button';
// ** Custom Components **//
import PatientDetailsHeader from '@/components/patient-details/PatientDetailsHeader';
import QuickActions from '@/components/patient-details/quick-actions/QuickActions';
import CustomPageTabs from '@/components/CustomPageTabs';
import { usePatient } from '@/hooks/usePatients';
import LoadingState from '@/components/LoadingState';
import CustomAlert from '@/components/CustomAlert';
import { useAuth } from '@/contexts/Auth/useAuth';

const PatientDetails = () => {
  const navigate = useNavigate();
  const { data: patientData, isLoading, isError } = usePatient();
  const { user } = useAuth();
  const patientName = patientData
    ? `${patientData.first_name} ${patientData.last_name}`
    : 'Unknown Patient';
  const tabsData = ['overview', 'medical-records', 'prescriptions', 'lab-results'];

  if (isLoading) {
    return <LoadingState fullPage="true" message="Loading Patient Details" />;
  }

  if (isError) {
    return <CustomAlert message="Couldn't get patient details" />;
  }

  if (!patientData) {
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
        patientId={patientData.patient_id}
        city={patientData.city}
      />

      {/* Quick Actions */}
      {user.role === 'doctor' && <QuickActions />}

      <CustomPageTabs tabs={tabsData} />

      <Outlet />
    </>
  );
};

export default PatientDetails;
