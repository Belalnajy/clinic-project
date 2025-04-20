import { getPatientLabResults } from '@/utils/patient';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { TabsContent } from '../ui/tabs';

const LabResultsTab = ({ patientId }) => {
  const LabResults = getPatientLabResults(patientId);
  console.log('LabResults:', LabResults);

  if (!LabResults.length) {
    return (
      <TabsContent value="lab-results">
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <h1 className="text-2xl font-semibold mb-2">No Lab Results Found</h1>
          <p className="text-slate-500 mb-6">The patient has no lab results available.</p>
        </div>
      </TabsContent>
    );
  }
  return (
    <TabsContent value="lab-results">
      <div className="space-y-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Lab Results</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              {LabResults.map((result) => (
                <div key={result.id} className="p-4 border rounded-md shadow-sm">
                  <h2 className="text-lg font-semibold">{result.testName}</h2>
                  <p className="text-sm text-gray-500">
                    Date: {new Date(result.date).toLocaleDateString()}
                  </p>
                  <p className="text-sm">Result: {result.result}</p>
                  <p className="text-sm">notes: {result.notes}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  );
};

export default LabResultsTab;
