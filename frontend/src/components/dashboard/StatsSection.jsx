import StatCard from "./StatCard";
import { ClipboardCheck, Clock } from "lucide-react";

const StatsSection = ({ stats }) => {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-4 mb-8">
      <StatCard
        title="My Patients Today"
        value={stats.patientsToday || "8"}
        change="2 more than yesterday"
        icon={<ClipboardCheck className="text-emerald-700" size={20} />}
        color="primary"
      />
      <StatCard
        title="Appointments Completed"
        value={stats.completedAppointments || "0/0"}
        change={`${stats.completionRate || 0}% completion rate`}
        icon={<ClipboardCheck className="text-emerald-700" size={20} />}
        color="success"
      />
      <StatCard
        title="Next Appointment"
        value={stats.nextAppointment || "10:30 AM"}
        change="In 25 minutes"
        icon={<Clock className="text-blue-700" size={20} />}
        color="info"
      />
      <StatCard
        title="Pending Lab Results"
        value={stats.pendingLabs || "3"}
        change="2 urgent"
        icon={<Clock className="text-amber-700" size={20} />}
        color="warning"
      />
    </div>
  );
};

export default StatsSection;
