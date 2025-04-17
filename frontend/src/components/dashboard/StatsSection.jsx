import {
    Card,
    CardContent,

  } from '@/components/ui/card';import { IconClipboardCheck, IconClock, IconFlask } from "@tabler/icons-react";

const StatsSection = ({ stats }) => {
  const StatCard = ({ title, value, change, icon, color = "primary" }) => {
    const colors = {
      primary: {
        bgGradient: "bg-gradient-to-br from-sky-50 to-indigo-50",
        iconBg: "bg-sky-100",
        iconColor: "text-sky-700",
        borderColor: "border-sky-100"
      },
      success: {
        bgGradient: "bg-gradient-to-br from-emerald-50 to-green-50",
        iconBg: "bg-emerald-100",
        iconColor: "text-emerald-700",
        borderColor: "border-emerald-100"
      },
      warning: {
        bgGradient: "bg-gradient-to-br from-amber-50 to-yellow-50",
        iconBg: "bg-amber-100",
        iconColor: "text-amber-700",
        borderColor: "border-amber-100"
      },
      info: {
        bgGradient: "bg-gradient-to-br from-blue-50 to-cyan-50",
        iconBg: "bg-blue-100",
        iconColor: "text-blue-700",
        borderColor: "border-blue-100"
      }
    };

    const style = colors[color];

    return (
      <Card
        className={`overflow-hidden ${style.bgGradient} border border-opacity-50 ${style.borderColor} shadow-sm transition-all duration-300 hover:shadow-md`}>
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">
                {title}
              </p>
              <h3 className="text-2xl font-semibold tracking-tight text-slate-800">
                {value}
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                {change}
              </p>
            </div>
            <div className={`rounded-full p-3 ${style.iconBg}`}>
              {icon}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
      <StatCard
        title="My Patients Today"
        value={stats.patientsToday || "8"}
        change="2 more than yesterday"
        icon={<IconClipboardCheck className="text-emerald-700" size={20} />}
        color="primary"
      />
      <StatCard
        title="Appointments Completed"
        value={stats.completedAppointments || "0/0"}
        change={`${stats.completionRate || 0}% completion rate`}
        icon={<IconClipboardCheck className="text-emerald-700" size={20} />}
        color="success"
      />
      <StatCard
        title="Next Appointment"
        value={stats.nextAppointment || "10:30 AM"}
        change="In 25 minutes"
        icon={<IconClock className="text-blue-700" size={20} />}
        color="info"
      />
      <StatCard
        title="Pending Lab Results"
        value={stats.pendingLabs || "3"}
        change="2 urgent"
        icon={<IconFlask className="text-amber-700" size={20} />}
        color="warning"
      />
    </div>
  );
};

export default StatsSection;
