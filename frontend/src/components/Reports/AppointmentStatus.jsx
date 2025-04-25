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
              <LabelList dataKey="name" className="fill-background" stroke="none" fontSize={12} />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
