import { TabsContent } from '../ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { getPrescriptionHistory } from '@/utils/patient';

const PrescriptionsTab = ({ patientId }) => {
  const prescriptionHistory = getPrescriptionHistory(patientId);
  console.log('Prescription History:', prescriptionHistory);
  return (
    <TabsContent value="prescriptions">
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Prescription History</CardTitle>
          </CardHeader>
          <CardContent>
            {/* <div className="space-y-3">
              <div className="border-b pb-3">
                <div className="flex justify-between">
                  <div className="font-medium">Lisinopril 10mg</div>
                  <div className="text-sm text-slate-500">Prescribed: June 12, 2023</div>
                </div>
                <div className="text-sm mt-1">
                  <div>
                    <span className="font-medium">Dosage: </span>1 tablet daily, morning
                  </div>
                  <div>
                    <span className="font-medium">Refills: </span>3 remaining
                  </div>
                  <div>
                    <span className="font-medium">Next Refill: </span>July 12, 2023
                  </div>
                </div>
              </div>
              <div className="border-b pb-3">
                <div className="flex justify-between">
                  <div className="font-medium">Hydrochlorothiazide 12.5mg</div>
                  <div className="text-sm text-slate-500">Prescribed: June 12, 2023</div>
                </div>
                <div className="text-sm mt-1">
                  <div>
                    <span className="font-medium">Dosage: </span>1 tablet daily, morning
                  </div>
                  <div>
                    <span className="font-medium">Refills: </span>3 remaining
                  </div>
                  <div>
                    <span className="font-medium">Next Refill: </span>July 12, 2023
                  </div>
                </div>
              </div>
              <div>
                <div className="flex justify-between">
                  <div className="font-medium">Aspirin 81mg</div>
                  <div className="text-sm text-slate-500">Prescribed: June 12, 2023</div>
                </div>
                <div className="text-sm mt-1">
                  <div>
                    <span className="font-medium">Dosage: </span>1 tablet daily, evening
                  </div>
                  <div>
                    <span className="font-medium">Refills: </span>11 remaining
                  </div>
                  <div>
                    <span className="font-medium">Next Refill: </span>July 12, 2023
                  </div>
                </div>
              </div>
            </div> */}
            {/* loop on prescription history and for each prescription render the medication data */}

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

export default PrescriptionsTab;
