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
import { FileArchive } from 'lucide-react';
import AgeDistribution from './AgeDistribution';
import GenderRatio from './GenderRatio';
import TopConditions from './TopConditions';
import Papa from 'papaparse';

const PatientDemographics = ({ analysis }) => {
  if (!analysis) return null;

  // Generate colors for conditions
  const coloredConditions = analysis.topConditions.map((d, i) => ({
    ...d,
    color: `hsl(${(i * 137.5) % 360}, 70%, 50%)`,
  }));

  // Prepare export data
  const handleExport = () => {
    // Age Distribution
    const ageRows = analysis.ageDistribution.map((d) => ({
      Category: 'Age',
      Label: d.name,
      Count: d.count,
    }));
    // Gender Ratio
    const genderRows = analysis.genderRatio.map((d) => ({
      Category: 'Gender',
      Label: d.name,
      Count: d.value,
    }));
    // Top Conditions
    const conditionRows = analysis.topConditions.map((d) => ({
      Category: 'Condition',
      Label: d.name,
      Count: d.count,
    }));
    // Patient Growth
    const growthRows = [
      { Category: 'Growth', Label: 'New', Count: analysis.patientGrowth.new },
      { Category: 'Growth', Label: 'Growth Rate', Count: analysis.patientGrowth.growthRate },
      { Category: 'Growth', Label: 'Total', Count: analysis.patientGrowth.total },
    ];
    const csvData = [...ageRows, ...genderRows, ...conditionRows, ...growthRows];
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'patient_demographics.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Demographics</CardTitle>
        <CardDescription>Analysis of patient population</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <AgeDistribution ageData={analysis.ageDistribution} />
        <GenderRatio genderData={analysis.genderRatio} />
        <TopConditions displayConditions={coloredConditions} />
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
