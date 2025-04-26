import { TabsContent } from '../../ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { usePrescriptions } from '@/hooks/usePrescriptions';
import LoadingState from '@/components/LoadingState';
import CustomAlert from '@/components/CustomAlert';
import CustomPagination from '@/components/CustomPagination';

const Prescriptions = ({ patientId }) => {
  const { prescriptionsData, isLoadingPrescriptions, prescriptionsError, pagination } =
    usePrescriptions();

  if (prescriptionsError) {
    return <CustomAlert type="error" message="Error loading prescriptions." />;
  }

  if (isLoadingPrescriptions) {
    return <LoadingState fullPage="true" message="Loading prescriptions..." />;
  }

  return (
    <TabsContent value="prescriptions">
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Prescription History</CardTitle>
          </CardHeader>
          <CardContent>
            {prescriptionsData.length === 0 ? (
              <p className="text-slate-500">No prescription history available.</p>
            ) : (
              <>
                {prescriptionsData.map((prescription) => (
                  <div key={prescription.id} className="py-3">
                    {/* Prescription Header */}
                    <div className="grid grid-cols-1 md:grid-cols-2 border-b-2 pb-3 text-sm bg-muted p-6">
                      <p>
                        <span className="font-bold">Prescription ID:</span> {prescription.id}
                      </p>
                      <p>
                        <span className="font-bold">Doctor:</span>{' '}
                        {prescription.medical_record.appointment.doctor.first_name}{' '}
                        {prescription.medical_record.appointment.doctor.last_name}
                      </p>
                      <p>
                        <span className="font-bold">Status:</span>{' '}
                        {prescription.is_active ? 'Active' : 'Inactive'}
                      </p>
                      <p>
                        <span className="font-bold">Prescribed:</span>{' '}
                        {new Date(prescription.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {/* Prescription Medications */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-6">
                      {prescription.medications.map((medication) => (
                        <div key={medication.id} className="py-3">
                          <div className="flex justify-between">
                            <div className="font-medium">{medication.medication.name}</div>
                          </div>
                          <div className="text-sm mt-1">
                            <div>
                              <span className="font-medium">Dosage: </span>
                              {medication.dosage}
                            </div>
                            <div>
                              <span className="font-medium">Duration: </span>
                              {medication.duration}
                            </div>
                            <div>
                              <span className="font-medium">Frequency: </span>
                              {medication.frequency}
                            </div>
                            <div>
                              <span className="font-medium">Instructions: </span>
                              {medication.instructions}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="mt-4">
                  <CustomPagination pagination={pagination} pageSize={2} />
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  );
};

export default Prescriptions;
