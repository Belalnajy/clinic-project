'use client';

import { TrendingUp } from 'lucide-react';
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useDailyCompletion } from '@/hooks/useDailyCompletion';

export default function Component(props) {
  const { dailyCompletionData } = props;
  const { mappedMonths, dateRange } = useDailyCompletion(dailyCompletionData);
  const chartConfig = {
    completed: {
      label: 'Completed',
      color: 'var(--color-chart-1)',
    },
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Completion</CardTitle>
        <CardDescription>{dateRange}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={mappedMonths}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              // tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Line
              dataKey="completed"
              type="linear"
              stroke="var(--color-completed)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          This chart visualizes the daily completion rates of appointments for the last 7 days{' '}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          It provides insights into the number of completed appointments over the past week.
        </div>
      </CardFooter>
    </Card>
  );
}
