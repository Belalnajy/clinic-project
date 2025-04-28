import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, AlertCircle, CheckCircle, DollarSign, Clock, FileCheck } from 'lucide-react';
import RevenueChart from './RevenueChart';
import PaymentMethodsChart from './PaymentMethodsChart';
import DepartmentRevenueChart from './DepartmentRevenueChart';
import { getRevenueData } from '@/data/data';
import { useReports } from '@/hooks/useReports';
import { formatCurrency, getCurrentMonthRevenueAndPercentage } from '@/lib/utils';
import LoadingState from '../LoadingState';
import CustomAlert from '../CustomAlert';

const FinanceSection = () => {
  const { financialMetrics, isLoadingFinancialMetrics, financialMetricsError } = useReports();

  if (isLoadingFinancialMetrics) {
    return <LoadingState fullPage={true} message="Loading Data..." />;
  }

  if (financialMetricsError) {
    return <CustomAlert message="Error Loading Data..." />;
  }
  const monthlyRevenue = getCurrentMonthRevenueAndPercentage(financialMetrics.monthly_revenue);
  console.log(financialMetrics);
  const { amount, count } = financialMetrics.pending_payments;
  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-2">
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
            <div className="text-3xl font-bold text-primary mb-1">{monthlyRevenue.revenue}</div>
            <div className="text-sm text-green-600 flex items-center mb-4">
              <TrendingUp className="h-4 w-4 mr-1" /> {monthlyRevenue.percentage}% from last month
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
            <div className="text-3xl font-bold text-orange-500 mb-1">{formatCurrency(amount)}</div>
            <div className="text-sm text-orange-600 flex items-center mb-4">
              <AlertCircle className="h-4 w-4 mr-1" /> {count} pending invoices
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-bold mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-primary" />
          Revenue Trends
        </h3>
        <RevenueChart revenueData={financialMetrics.monthly_revenue} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-bold mb-4">Payment Methods</h3>
          <PaymentMethodsChart data={financialMetrics.payment_methods} />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-bold mb-4">Department Revenue</h3>
          <DepartmentRevenueChart departmentData={financialMetrics.specialization_payments} />
        </div>
      </div>
    </div>
  );
};

export default FinanceSection;
