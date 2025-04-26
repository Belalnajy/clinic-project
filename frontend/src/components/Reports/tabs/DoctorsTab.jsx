import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import DoctorPerformance from '../DoctorPerformance';
import { useReports } from '@/hooks/useReports';
import { useSearchParams } from 'react-router-dom';

const DoctorsTab = () => {
  const { doctorPerformanceData, isLoadingDoctorPerformance } = useReports();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  // Calculate total pages based on count and page size (10 from backend)
  const pageSize = 10;
  const totalPages = doctorPerformanceData?.count
    ? Math.ceil(doctorPerformanceData.count / pageSize)
    : 1;

  const handlePageChange = (page) => {
    setSearchParams((prev) => {
      prev.set('page', page);
      return prev;
    });
  };

  return (
    <TabsContent value="doctors" className="mt-6">
      <DoctorPerformance
        data={doctorPerformanceData}
        isLoading={isLoadingDoctorPerformance}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </TabsContent>
  );
};

export default DoctorsTab;
