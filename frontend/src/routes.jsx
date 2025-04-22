import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from './pages/layouts/MainLayout';
import SettingsPage from './pages/SettingsPage';
import ProfileSettings from './components/settings/ProfileSettings';
import AccountSettings from './components/settings/AccountSettings';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import LoginPage from './pages/Login';
import Reports from './pages/Reports';
import DoctorsPage from './pages/DoctorsPage';
import Appointments from './pages/Appointments';
import ManagerDashboard from './pages/ManagerDashboard';
import PatientDetails from './pages/patient-details/PatientDetails';
import SecretaryDashboard from './pages/SecretaryDashboard';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
    errorElement: <div>404 Not Found</div>,
  },
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <div>404 Not Found</div>,
    children: [
      {
        path: 'settings',
        element: <SettingsPage />,
        children: [
          { index: true, element: <Navigate to="profile" replace /> },
          { path: 'profile', element: <ProfileSettings /> },
          { path: 'account', element: <AccountSettings /> },
        ],
      },
      { path: 'dashboard/doctor', element: <Dashboard /> },
      { path: 'dashboard/secretary', element: <SecretaryDashboard /> },
      { path: 'dashboard/manager', element: <ManagerDashboard /> },
      { path: 'reports', element: <Reports /> },
      { path: 'doctors', element: <DoctorsPage /> },
      { path: 'patients', element: <Patients /> },
      { path: 'patient/:id', element: <PatientDetails /> },
      ,
      { path: 'appointments', element: <Appointments /> },
    ],
  },
]);

export default router;
