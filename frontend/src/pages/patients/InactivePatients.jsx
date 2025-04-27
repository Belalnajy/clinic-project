import { usePatientsList } from '@/hooks/usePatients';
import CustomPagination from '@/components/CustomPagination';
import LoadingState from '@/components/LoadingState';
import CustomAlert from '@/components/CustomAlert';
import { User } from 'lucide-react';
import PatientCard from '@/components/patient/PatientCard';

const InactivePatients = () => {
  const { patientsData, patientsLoading, patientsError, pagination } = usePatientsList(false);

  if (patientsLoading) {
    return <LoadingState fullPage={true} message="Loading inactive patients..." />;
  }

  if (patientsError) {
    return <CustomAlert message="Error loading inactive patients" />;
  }

  if (patientsData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <User className="w-12 h-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">No Inactive Patients</h3>
        <p className="text-sm text-gray-500">
          There are currently no inactive patients in the system.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {patientsData.map((patient) => (
          <PatientCard key={patient.id} patient={patient} isActive={false} />
        ))}
      </div>

      <CustomPagination pagination={pagination} />
    </div>
  );
};

export default InactivePatients;
