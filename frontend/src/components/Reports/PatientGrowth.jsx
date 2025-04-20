import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';

const PatientGrowth = ({ stats }) => {
  const { new: newPatients, growthRate, total: totalPatients } = stats;
  console.log(stats);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Patient Growth</CardTitle>
        <CardDescription>New patient registrations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-auto flex flex-col items-center justify-center space-y-4">
          <div className="text-4xl md:text-5xl font-bold text-primary-600">{newPatients}</div>
          <div className="text-sm text-slate-500 mt-2">New patients in last 30 days</div>
          <div className="mt-6 w-full bg-slate-100 rounded-full h-3 md:h-4 overflow-hidden">
            <div
              className="bg-primary-600 h-full rounded-full transition-all duration-700"
              style={{ width: `${growthRate}%` }}
            ></div>
          </div>
          <div className="mt-2 text-xs text-slate-500 self-end">
            {Math.round(growthRate)}% growth rate
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between text-sm text-slate-500">
        <div>Total Patients: {totalPatients}</div>
      </CardFooter>
    </Card>
  );
};

export default PatientGrowth;
