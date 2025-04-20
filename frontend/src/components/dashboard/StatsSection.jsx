import StatCard from './StatCard';
import { ClipboardCheck, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/Auth/useAuth';

const StatsSection = ({ stats }) => {
  const { user } = useAuth();

  if (user.role === 'secretary') {
    return (
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-4 mb-8">
        <StatCard
          title="Today's Check-ins"
          value="14"
          change="58% of scheduled from last month"
          icon={<ClipboardCheck className="text-emerald-700" size={20} />}
          color="primary"
        />
        <StatCard
          title="Waiting Patients"
          value="5"
          change="63% of today's schedule from last month"
          icon={<ClipboardCheck className="text-emerald-700" size={20} />}
          color="success"
        />
        <StatCard
          title="Available Doctors"
          value="6"
          change="2 on leave today"
          icon={<Clock className="text-blue-700" size={20} />}
          color="info"
        />
        <StatCard
          title="New Registrations"
          value="4"
          change="Today from last month"
          icon={<Clock className="text-amber-700" size={20} />}
          color="warning"
        />
      </div>
    );
  }
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-4 mb-8">
      <StatCard
        title="My Patients Today"
        value={stats.patientsToday || '8'}
        change="2 more than yesterday"
        icon={<ClipboardCheck className="text-emerald-700" size={20} />}
        color="primary"
      />
      <StatCard
        title="Appointments Completed"
        value={stats.completedAppointments || '0/0'}
        change={`${stats.completionRate || 0}% completion rate`}
        icon={<ClipboardCheck className="text-emerald-700" size={20} />}
        color="success"
      />
      <StatCard
        title="Next Appointment"
        value={stats.nextAppointment || '10:30 AM'}
        change="In 25 minutes"
        icon={<Clock className="text-blue-700" size={20} />}
        color="info"
      />
      <StatCard
        title="Pending Lab Results"
        value={stats.pendingLabs || '3'}
        change="2 urgent"
        icon={<Clock className="text-amber-700" size={20} />}
        color="warning"
      />
    </div>
  );
};

export default StatsSection;
