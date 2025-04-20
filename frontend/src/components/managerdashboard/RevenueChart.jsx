import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const RevenueChart = ({ revenueData }) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Revenue Trends</CardTitle>
        <CardDescription>Annual financial performance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={revenueData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="thisYear" stackId="1" stroke="#8884d8" fill="#8884d8" name="This Year" />
              <Area type="monotone" dataKey="lastYear" stackId="2" stroke="#82ca9d" fill="#82ca9d" name="Last Year" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;