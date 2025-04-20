import { TabsContent } from '../ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { getPatientDiagnoses } from '@/utils/patient';
const MedicalRecordsTab = ({ patientId }) => {
  const diagnosisHistory = getPatientDiagnoses(patientId);
  console.log('Diagnosis History:', diagnosisHistory);

  return (
    <TabsContent value="medical-records">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Previous Diagnoses</CardTitle>
          <Button variant="outline" size="sm">
            <i className="fas fa-file-export mr-2"></i> Export History
          </Button>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            {diagnosisHistory?.length > 0 ? (
              diagnosisHistory.map((record, index) => (
                <div key={index} className="border p-4 rounded-md">
                  <h3 className="text-lg font-semibold mb-2">{record.diagnosis}</h3>
                  <p className="mb-2">{record.description}</p>
                  <p className="text-sm text-gray-500 mb-2">{record.notes}</p>
                  <p className="text-sm text-gray-500 ">
                    {new Date(record.date).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <p>No previous diagnoses found.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default MedicalRecordsTab;
