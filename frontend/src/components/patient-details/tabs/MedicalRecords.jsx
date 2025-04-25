import { TabsContent } from '../../ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { useMedicalRecords } from '@/hooks/useMedicalRecords';
import LoadingState from '@/components/LoadingState';
import CustomPagination from '@/components/CustomPagination';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import CustomAlert from '@/components/CustomAlert';

const MedicalRecords = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  const { id: patientId } = useParams();

  const { medicalRecords, pagination, isLoadingMedicalRecords, medicalRecordsError } =
    useMedicalRecords(patientId);

  const handlePageChange = (page) => {
    // Preserve the tab selection when changing pages
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', page);
    navigate(`/patient/${patientId}?${newSearchParams.toString()}#medical-records`);
  };

  if (isLoadingMedicalRecords) {
    return (
      <TabsContent value="medical-records">
        <LoadingState message="Loading medical records..." />
      </TabsContent>
    );
  }

  if (medicalRecordsError) {
    return (
      <TabsContent value="medical-records">
        <CustomAlert message="Error loading medical records. Please try again later." />
      </TabsContent>
    );
  }

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
            {medicalRecords?.length > 0 ? (
              medicalRecords.map((record) => (
                <div key={record.id} className="border p-4 rounded-md">
                  <h3 className="text-lg font-semibold mb-2">{record.diagnosis}</h3>
                  <p className="mb-2">{record.description}</p>
                  <p className="text-sm text-gray-500 mb-2">{record.notes}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(record.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <p>No previous diagnoses found.</p>
            )}
          </div>

          {pagination.count > 0 && (
            <div className="mt-4">
              <CustomPagination
                totalItems={pagination.count}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                hasNextPage={!!pagination.next}
                hasPreviousPage={!!pagination.previous}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default MedicalRecords;
