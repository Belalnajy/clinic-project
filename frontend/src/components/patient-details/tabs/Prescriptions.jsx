import { TabsContent } from '../../ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { usePrescriptions } from '@/hooks/usePrescriptions';
import LoadingState from '@/components/LoadingState';
import CustomAlert from '@/components/CustomAlert';
import CustomPagination from '@/components/CustomPagination';
import PrescriptionHeader from '../PrescriptionHeader';
import PrescriptionMedications from '../PrescriptionMedications';

const Prescriptions = () => {
  const { prescriptionsData, isLoadingPrescriptions, prescriptionsError, pagination } =
    usePrescriptions();

  if (prescriptionsError) {
    return <CustomAlert type="error" message="Error loading prescriptions." />;
  }

  if (isLoadingPrescriptions) {
    return <LoadingState fullPage={true} message="Loading prescriptions..." />;
  }

  if (prescriptionsData.length === 0) {
    return <CustomAlert message="No prescription history available." variant="alert" />;
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Prescription History</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            {prescriptionsData.map((prescription) => (
              <div key={prescription.id}>
                {/* Prescription Header */}
                <PrescriptionHeader prescription={prescription} />
                {/* Prescription Medications */}
                <PrescriptionMedications medications={prescription.medications} />
              </div>
            ))}
          </div>
          {/* Custom Pagination */}
          <div className="mt-4">
            <CustomPagination pagination={pagination} pageSize={2} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Prescriptions;
