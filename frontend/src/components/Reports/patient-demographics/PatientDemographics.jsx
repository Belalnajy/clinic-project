import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FileArchive } from 'lucide-react';
import { ageBuckets } from './graph_data';
import { usePatients } from '@/hooks/usePatients';
import AgeDistribution from './AgeDistribution';
import GenderRatio from './GenderRatio';
import TopConditions from './TopConditions';

const PatientDemographics = ({ patients }) => {
  const { ageData, genderData, displayConditions, handleExport } = usePatients(
    patients,
    ageBuckets
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Demographics</CardTitle>
        <CardDescription>Analysis of patient population</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Age Distribution */}
        <AgeDistribution ageData={ageData} />
        {/* Gender Ratio */}
        <GenderRatio genderData={genderData} />

        {/* Top Conditions */}
        <TopConditions displayConditions={displayConditions} />
      </CardContent>
      <CardFooter className="flex mt-5 flex-col md:flex-row justify-end gap-4">
        <Button
          size="lg"
          className="border-slate-200 bg-secondary text-slate-800 hover:bg-slate-200  hover:cursor-pointer"
          onClick={handleExport}
        >
          <FileArchive size={16} className="mr-2 text-slate-800" /> Export
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PatientDemographics;
