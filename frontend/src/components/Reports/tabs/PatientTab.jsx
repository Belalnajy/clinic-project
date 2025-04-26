import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import PatientDemographics from '../patient-demographics/PatientDemographics';
import { useReports } from '@/hooks/useReports';

const PatientTab = () => {
  const { patientAnalysis, isLoadingPatientAnalysis } = useReports();

  if (isLoadingPatientAnalysis) {
    return (
      <TabsContent value="patients" className="mt-6">
        <div className="flex justify-center items-center h-[400px]">Loading...</div>
      </TabsContent>
    );
  }

  return (
    <TabsContent value="patients" className="mt-6">
      <PatientDemographics analysis={patientAnalysis} />
    </TabsContent>
  );
};

export default PatientTab;
