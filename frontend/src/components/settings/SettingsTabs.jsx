import { NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/Auth/useAuth';

function SettingsTabs() {
  const { user } = useAuth();
  const tabs = ['profile', 'account', ...(user?.role === 'doctor' ? ['professional'] : [])];

  return (
    <div className="flex gap-4 p-2 bg-muted rounded-md w-fit">
      {tabs.map((tab) => (
        <NavLink
          key={tab}
          to={tab}
          className={({ isActive }) =>
            `px-4 py-2 rounded-md text-sm capitalize ${
              isActive ? 'bg-white shadow font-medium' : 'text-muted-foreground'
            }`
          }
        >
          {tab}
        </NavLink>
      ))}
    </div>
  );
}

export default SettingsTabs;
