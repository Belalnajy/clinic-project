import { TabsContent } from '../../ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { getPrescriptionHistory } from '@/utils/patient';

const Prescriptions = ({ patientId }) => {
  const prescriptionHistory = getPrescriptionHistory(patientId);

  return (
    <TabsContent value="prescriptions">
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Prescription History</CardTitle>
          </CardHeader>
          <CardContent>
            {prescriptionHistory.length === 0 ? (
              <p className="text-slate-500">No prescription history available.</p>
            ) : (
              prescriptionHistory.map((prescription) => (
                <div key={prescription.prescriptionId} className="border-b pb-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 border-b-2 pb-3 text-sm">
                    <p>
                      <span className="font-bold">Prescription ID:</span>{' '}
                      {prescription.prescriptionId}
                    </p>
                    <p>
                      <span className="font-bold">Doctor:</span> {prescription.prescribedBy.name}
                    </p>
                    <p>
                      <span className="font-bold">Status:</span> {prescription.status}
                    </p>
                    <p>
                      <span className="font-bold">Prescribed:</span>{' '}
                      {new Date(prescription.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {prescription.medications.map((medication) => (
                      <div key={medication.id} className=" py-3">
                        <div key={medication.id} className="flex justify-between">
                          <div className="font-medium">{medication.name}</div>
                        </div>
                        <div className="text-sm mt-1">
                          <div>
                            <span className="font-medium">Dosage: </span>
                            {medication.dosage}
                          </div>
                          <div>
                            <span className="font-medium">Refills: </span>
                            {medication.refills} remaining
                          </div>
                          <div>
                            <span className="font-medium">Next Refill: </span>
                            {new Date(prescription.endDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  );
};

export default Prescriptions;
