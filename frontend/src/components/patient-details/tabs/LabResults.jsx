import { usePatientLabResults } from '@/hooks/useLabResults';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { TabsContent } from '../../ui/tabs';
import LoadingState from '@/components/LoadingState';
import CustomAlert from '@/components/CustomAlert';
import { useParams } from 'react-router-dom';
import CustomPagination from '@/components/CustomPagination';

const LabResults = () => {
  const { id: patientId } = useParams();
  const { labResults, labResultsLoading, labResultsError, pagination } =
    usePatientLabResults(patientId);
  console.log(labResults);
  if (labResultsLoading) {
    return <LoadingState fullPage="true" message="Loading Lab Results..." />;
  }

  if (labResultsError) {
    return <CustomAlert message="Error Loading Lab Results" />;
  }

  if (!labResults.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <h1 className="text-2xl font-semibold mb-2">No Lab Results Found</h1>
        <p className="text-slate-500 mb-6">The patient has no lab results available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Lab Results</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            {labResults.map((result) => (
              <div key={result.id} className="p-4 border rounded-md shadow-sm">
                <h2 className="text-lg font-semibold">{result.test_name}</h2>
                <p className="text-sm text-gray-500">
                  Date: {new Date(result.test_date).toLocaleDateString()}
                </p>
                <p className="text-sm">Result: {result.results}</p>
                <p className="text-sm">Notes: {result.notes}</p>
              </div>
            ))}
          </div>

          <CustomPagination pagination={pagination} />
        </CardContent>
      </Card>
    </div>
  );
};

export default LabResults;
