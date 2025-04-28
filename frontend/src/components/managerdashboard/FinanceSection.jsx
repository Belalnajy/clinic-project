import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, AlertCircle, CheckCircle, DollarSign, Clock, FileCheck } from 'lucide-react';
import RevenueChart from './RevenueChart';
import PaymentMethodsChart from './PaymentMethodsChart';
import DepartmentRevenueChart from './DepartmentRevenueChart';
import { getRevenueData } from '@/data/data';

const FinanceSection = () => {
  const revenueData = getRevenueData();

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-l-4 border-l-primary shadow-md hover:shadow-lg transition-all">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold">Monthly Revenue</CardTitle>
                <CardDescription>Current vs Last Month</CardDescription>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary mb-1">$52,400</div>
            <div className="text-sm text-green-600 flex items-center mb-4">
              <TrendingUp className="h-4 w-4 mr-1" /> 12% from last month
            </div>
            <Progress value={75} className="h-2 mb-2" />
            <div className="text-xs text-gray-500 flex justify-between">
              <span>75% of target reached</span>
              <span className="font-medium">$70,000</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 shadow-md hover:shadow-lg transition-all">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold">Outstanding Payments</CardTitle>
                <CardDescription>Pending patient bills</CardDescription>
              </div>
              <div className="p-2 bg-orange-100 rounded-full">
                <Clock className="h-5 w-5 text-orange-500" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-500 mb-1">$8,240</div>
            <div className="text-sm text-orange-600 flex items-center mb-4">
              <AlertCircle className="h-4 w-4 mr-1" /> 14 pending invoices
            </div>
            <Progress value={35} className="h-2 mb-2" indicatorClassName="bg-orange-500" />
            <div className="text-xs text-gray-500 flex justify-between">
              <span>35% increase since last week</span>
              <span className="font-medium">+$2,150</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 shadow-md hover:shadow-lg transition-all">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold">Insurance Claims</CardTitle>
                <CardDescription>Processed this month</CardDescription>
              </div>
              <div className="p-2 bg-blue-100 rounded-full">
                <FileCheck className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-500 mb-1">128</div>
            <div className="text-sm text-blue-600 flex items-center mb-4">
              <CheckCircle className="h-4 w-4 mr-1" /> 92% approval rate
            </div>
            <Progress value={92} className="h-2 mb-2" indicatorClassName="bg-blue-500" />
            <div className="text-xs text-gray-500 flex justify-between">
              <span>8 claims pending review</span>
              <span className="font-medium">92/100</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-bold mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-primary" />
          Revenue Trends
        </h3>
        <RevenueChart revenueData={revenueData} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-bold mb-4">Payment Methods</h3>
          <PaymentMethodsChart />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-bold mb-4">Department Revenue</h3>
          <DepartmentRevenueChart />
        </div>
      </div>
    </div>
  );
};

export default FinanceSection;
