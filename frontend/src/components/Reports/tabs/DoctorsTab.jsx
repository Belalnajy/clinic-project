import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import DoctorPerformance from '../DoctorPerformance';

const DoctorsTab = (stats) => {
  return (
    <TabsContent value="doctors" className="mt-6">
      <DoctorPerformance stats={stats} />
    </TabsContent>
  );
};

export default DoctorsTab;
