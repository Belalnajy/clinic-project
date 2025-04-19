import React from 'react';
import Papa from 'papaparse';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FileArchive } from 'lucide-react';

const DoctorPerformance = (props) => {
  const { stats } = props;

  const handleExport = () => {
    const csvData = stats.doctorStats.performance.map((doctor) => ({
      Doctor: doctor.name,
      Specialization: doctor.specialization,
      Appointments: doctor.appointments,
      'Completion Rate': `${doctor.completionRate}%`,
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'doctor_performance.csv');
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Doctor Performance</CardTitle>
        <CardDescription>Efficiency and workload analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead>
                <tr className="border-b transition-colors hover:bg-slate-50">
                  <th className="h-12 px-4 text-left align-middle font-medium text-slate-500">
                    Doctor
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-slate-500">
                    Specialization
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-slate-500">
                    Appointments
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-slate-500">
                    Completion Rate
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.doctorStats.performance.map((doctor) => (
                  <tr key={doctor.id} className="border-b transition-colors hover:bg-slate-50">
                    <td className="p-4 align-middle font-medium">{doctor.name}</td>
                    <td className="p-4 align-middle">{doctor.specialization}</td>
                    <td className="p-4 align-middle">{doctor.appointments}</td>
                    <td className="p-4 align-middle">
                      <div className="flex items-center">
                        <Progress value={doctor.completionRate} className="w-40 mr-3" />
                        <span>{doctor.completionRate}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
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

export default DoctorPerformance;
