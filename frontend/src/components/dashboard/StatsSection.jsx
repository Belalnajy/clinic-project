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
          value={stats.patients_today ?? '0'}
          change={stats.checkinsChange ?? ''}
          icon={<ClipboardCheck className="text-emerald-700" size={20} />}
          color="primary"
        />
        <StatCard
          title="Waiting Patients"
          value={stats.waiting_patients ?? '0'}
          change={stats.waitingChange ?? ''}
          icon={<ClipboardCheck className="text-emerald-700" size={20} />}
          color="success"
        />
        <StatCard
          title="Available Doctors"
          value={stats.available_doctors ?? '0'}
          change={stats.doctorChange ?? ''}
          icon={<Clock className="text-blue-700" size={20} />}
          color="info"
        />
        <StatCard
          title="New Registrations"
          value={stats.new_registrations ?? '0'}
          change={stats.registrationChange ?? ''}
          icon={<Clock className="text-amber-700" size={20} />}
          color="warning"
        />
      </div>
    );
  }
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-1 xl:grid-cols-3 mb-8">
      <StatCard
        title="My Patients Today"
        value={stats.patients_today ?? '0'}
        change={stats.patientsTodayChange ?? ''}
        icon={<ClipboardCheck className="text-emerald-700" size={20} />}
        color="primary"
      />
      <StatCard
        title="Appointments Today"
        value={stats.appointments_today ?? '0'}
        change={stats.appointmentsTodayChange ?? ''}
        icon={<ClipboardCheck className="text-emerald-700" size={20} />}
        color="success"
      />

      <StatCard
        title="New Registrations"
        value={stats.new_registrations ?? '0'}
        change={stats.registrationChange ?? ''}
        icon={<Clock className="text-amber-700" size={20} />}
        color="warning"
      />
    </div>
  );
};

export default StatsSection;
