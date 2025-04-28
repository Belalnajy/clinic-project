import { useAuth } from '@/contexts/Auth/useAuth';
import DashboardHeader from '../components/managerdashboard/DashboardHeader';
import CustomPageTabs from '@/components/CustomPageTabs';
import { Outlet } from 'react-router-dom';

const ManagerDashboard = () => {
  const { user } = useAuth();
  const tabsData = ['overview', 'Finance'];
  return (
    <div>
      <DashboardHeader userName={user.first_name} />

      <CustomPageTabs tabs={tabsData} />

      <Outlet />
    </div>
  );
};

export default ManagerDashboard;
