import {
  Users,
  Calendar,
  User2Icon,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  User
} from "lucide-react";

// Helper to safely format numbers (with commas)
function formatNumber(val) {
  if (val === undefined || val === null || isNaN(val)) return '-';
  return Number(val).toLocaleString();
}
// Helper to format currency (USD, you can adjust)
function formatCurrency(val) {
  if (val === undefined || val === null || isNaN(val)) return '-';
  return '$' + Number(val).toLocaleString();
}

const StatCard = ({
  title,
  value,
  change,
  icon: IconComponent,
  bgColor,
  textColor,
  isCurrency = false
}) => {
  // allow change to be undefined/null
  const isPositive = change !== undefined && change !== null && !String(change).startsWith("-");
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-lg ${bgColor}`}>
          <IconComponent className={`w-6 h-6 ${textColor}`} />
        </div>
        <div
          className={`flex items-center text-sm font-medium ${isPositive
            ? "text-green-600"
            : "text-red-600"}`}>
          {change !== undefined && change !== null && change !== '' ? (
            <>
              <span>{change}%</span>
              {isPositive
                ? <ArrowUpRight className="w-4 h-4 ml-1" />
                : <ArrowDownRight className="w-4 h-4 ml-1" />}
            </>
          ) : (
            <span className="text-gray-400">-</span>
          )}
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-1">
        {isCurrency ? formatCurrency(value) : formatNumber(value)}
      </h3>
      <p className="text-gray-500 text-sm">
        {title}
      </p>
    </div>
  );
};

const StatisticsCards = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
      <StatCard
        title="Total Patients"
        value={stats.patients}
        change={stats.patientGrowth}
        icon={Users}
        bgColor="bg-blue-50"
        textColor="text-blue-600"
      />
      <StatCard
        title="Today's Appointments"
        value={stats.appointments}
        change={stats.appointmentGrowth}
        icon={Calendar}
        bgColor="bg-indigo-50"
        textColor="text-indigo-600"
      />
      <StatCard
        title="Available Doctors"
        value={stats.availableDoctors}
        change={stats.doctorChangePercent}
        icon={User2Icon}
        bgColor="bg-green-50"
        textColor="text-green-600"
      />
      <StatCard
        title="Total Revenue"
        value={stats.revenue}
        change={stats.revenueGrowth}
        icon={TrendingUp}
        bgColor="bg-purple-50"
        textColor="text-purple-600"
        isCurrency={true}
      />
    </div>
  );
};

export default StatisticsCards;
