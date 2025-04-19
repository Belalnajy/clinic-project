import { TrendingUp } from 'lucide-react';
import { LabelList, Pie, PieChart } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

export default function Component(props) {
  const { appointmentStatusData } = props;
  const chartData = [
    { browser: 'chrome', visitors: 275, fill: 'var(--color-scheduled)' },
    { browser: 'safari', visitors: 200, fill: 'var(--color-in_queue)' },
    { browser: 'firefox', visitors: 187, fill: 'var(--color-completed)' },
    { browser: 'edge', visitors: 173, fill: 'var(--color-cancelled)' },
    { browser: 'other', visitors: 90, fill: 'var(--color-other)' },
  ];

  const chartConfig = {
    scheduled: {
      label: 'Scheduled',
      color: 'var(--color-chart-1)',
    },
    in_queue: {
      label: 'In-Queue',
      color: 'var(--color-chart-8)',
    },
    completed: {
      label: 'Completed',
      color: 'var(--color-chart-7)',
    },
    cancelled: {
      label: 'Cancelled',
      color: 'var(--color-chart-9)',
    },
  };
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Appointment Status</CardTitle>
        <CardDescription>Distribution by status</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] [&_.recharts-text]:fill-background"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="value" hideLabel />} />
            <Pie data={appointmentStatusData} dataKey="value">
              <LabelList
                dataKey="name"
                className="fill-background"
                stroke="none"
                fontSize={12}
                // formatter={(value: keyof typeof chartConfig) =>
                //   chartConfig[value]?.label
                // }
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

// const AppointmentStatus = ({ stats }) => {
//   const statusColors = {
//     scheduled: '#FBBF24', // Yellow
//     inQueue: '#3B82F6', // Blue
//     completed: '#10B981', // Green
//     cancelled: '#EF4444', // Red
//   };

//   return (
//     <div className="h-auto flex flex-col items-center justify-center space-y-4 md:space-y-6">
//       {['scheduled', 'inQueue', 'completed', 'cancelled'].map((status) => (
//         <div key={status} className="w-full space-y-2">
//           <div className="flex justify-between items-center">
//             <span className="text-sm capitalize">{status}</span>
//             <span className="text-sm font-medium">{stats[status]}</span>
//           </div>
//           <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
//             <div
//               className="h-full rounded-full transition-all duration-700"
//               style={{
//                 width: `${(stats[status] / stats.total) * 100}%`,
//                 backgroundColor: statusColors[status],
//               }}
//             ></div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default AppointmentStatus;
