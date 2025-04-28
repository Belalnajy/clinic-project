import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/Auth/useAuth';

const roleBasedTabs = {
  doctor: [
    { value: 'schedule', label: 'Schedule' },
    { value: 'patients', label: 'Patients' },
    { value: 'records', label: 'Medical Records' },
  ],
  secretary: [
    { value: 'appointments', label: 'Appointments' },
    // { value: 'check-in', label: 'Check-in' },
    { value: 'patients', label: 'Patients' },
  ],
};

const TabsHeader = () => {
  const { user } = useAuth();
  const tabs = roleBasedTabs[user.role || 'doctor'];

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center mb-6 w-full">
      <div className="w-full overflow-x-auto pb-2 sm:w-auto sm:overflow-visible sm:pb-0">
        <TabsList className="bg-slate-100 p-1 rounded-lg flex gap-1 min-w-max sm:min-w-0">
          {tabs.map(({ value, label }) => (
            <TabsTrigger
              key={value}
              value={value}
              className={cn(
                'relative px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-md transition-all duration-300 ease-in-out',
                'data-[state=active]:bg-white data-[state=active]:shadow-sm sm:data-[state=active]:shadow-md data-[state=active]:scale-[1.02]',
                'hover:cursor-pointer whitespace-nowrap'
              )}
            >
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

    </div>
  );
};

export default TabsHeader;
