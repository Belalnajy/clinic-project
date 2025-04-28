import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { useParams } from 'react-router-dom';
import { useMedicalRecords } from '@/hooks/useMedicalRecords';
import LoadingState from '@/components/LoadingState';
import CustomAlert from '@/components/CustomAlert';

const CurrentCondition = () => {
  const { id: patientId } = useParams();
  const { useLatestMedicalRecord } = useMedicalRecords();
  const {
    data: medicalRecord,
    isLoading: medRecLoading,
    isError: medRecError,
  } = useLatestMedicalRecord(patientId);

  if (medRecLoading) {
    return <LoadingState fullPage={true} message="Loading Patient Personal Info" />;
  }

  if (medRecError) {
    return <CustomAlert message="Couldn't get patient details" />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Condition</CardTitle>
      </CardHeader>
      <CardContent>
        {medicalRecord ? (
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Diagnosis</div>
              <div className="text-sm mt-1">{medicalRecord.diagnosis || 'Not specified'}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Description</div>
              <div className="text-sm mt-1">{medicalRecord.description || 'Not specified'}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Notes</div>
              <div className="text-sm mt-1">{medicalRecord.notes || 'No additional notes'}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Record Date</div>
              <div className="text-sm mt-1">
                {medicalRecord.created_at
                  ? format(new Date(medicalRecord.created_at), 'MMM dd, yyyy')
                  : 'Not specified'}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">No current condition found.</div>
        )}
      </CardContent>
    </Card>
  );
};

export default CurrentCondition;
