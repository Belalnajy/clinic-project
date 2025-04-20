import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import PatientDemographics from '../patient-demographics/PatientDemographics';

const PatientTab = ({ patients }) => {
  return (
    <TabsContent value="patients" className="mt-6">
      <PatientDemographics patients={patients} />
    </TabsContent>
  );
};

export default PatientTab;
