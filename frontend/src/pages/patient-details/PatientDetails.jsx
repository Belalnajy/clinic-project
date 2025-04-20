import { useNavigate } from 'react-router-dom';

//**  ShadCN UI Components **//
import { Button } from '@/components/ui/button';
import PatientDetailsHeader from '@/components/patient-details/PatientDetailsHeader';

const PatientDetails = () => {
  const navigate = useNavigate();
  //! Replace with actual patient ID from route params or state
  const patientId = 1;
  const patient = null;
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
      <PatientDetailsHeader patientName={patientName} />

      {/* Patient Overview */}
    </>
  );
};

export default PatientDetails;
