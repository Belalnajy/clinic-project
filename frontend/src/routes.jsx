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
import { ProtectedRoute } from './components/ProtectedRoute';
import UnauthorizedPage from './pages/UnauthorizedPage';
import RegisterPage from './pages/Register';
import MedicationsPage from './pages/MedicationsPage';
import MedicationsTable from './pages/medications/MedicationsTable';
import MedicationForm from './pages/MedicationForm';
import RootRedirect from './components/RootRedirect';
import AiAssistant from './pages/AiAssistant';
import SpecializationsPage from './pages/specializations';

const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <ProtectedRoute requireAuth={false}>
        <LoginPage />
      </ProtectedRoute>
    ),
    errorElement: <div>404 Not Found</div>,
  },
  {
    path: '/unauthorized',
    element: <UnauthorizedPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    errorElement: <div>404 Not Found</div>,
    children: [
      {
        index: true,
        element: <RootRedirect />,
      },
      {
        path: 'dashboard',
        element: <RootRedirect />,
      },
      {
        path: 'settings',
        element: (
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <Navigate to="profile" replace /> },
          { path: 'profile', element: <ProfileSettings /> },
          { path: 'account', element: <AccountSettings /> },
        ],
      },
      {
        path: 'dashboard/doctor',
        element: (
          <ProtectedRoute allowedRoles={['doctor']}>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'dashboard/secretary',
        element: (
          <ProtectedRoute allowedRoles={['secretary']}>
            <SecretaryDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'dashboard/manager',
        element: (
          <ProtectedRoute allowedRoles={['manager']}>
            <ManagerDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'register',
        element: (
          <ProtectedRoute allowedRoles={['manager']}>
            <RegisterPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'specializations',
        element: (
          <ProtectedRoute allowedRoles={['manager']}>
            <SpecializationsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'reports',
        element: (
          <ProtectedRoute allowedRoles={['manager']}>
            <Reports />
          </ProtectedRoute>
        ),
      },
      {
        path: 'doctors',
        element: (
          <ProtectedRoute allowedRoles={['manager']}>
            <DoctorsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'patients',
        element: (
          <ProtectedRoute allowedRoles={['doctor', 'secretary', 'manager']}>
            <Patients />
          </ProtectedRoute>
        ),
      },
      {
        path: 'patient/:id',
        element: (
          <ProtectedRoute allowedRoles={['doctor', 'secretary', 'manager']}>
            <PatientDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: 'appointments',
        element: (
          <ProtectedRoute allowedRoles={['doctor', 'secretary', 'manager']}>
            <Appointments />
          </ProtectedRoute>
        ),
      },
      {
        path: 'medications',
        element: (
          <ProtectedRoute allowedRoles={['doctor', 'manager']}>
            <MedicationsPage />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <MedicationsTable /> },
          {
            path: 'new',
            element: <MedicationForm />,
          },
          {
            path: ':id/edit',
            element: <MedicationForm />,
          },
        ],
      },

      {
        path: 'ai-assistant',
        element: (
          <ProtectedRoute allowedRoles={['doctor', 'secretary', 'manager']}>
            <AiAssistant />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default router;
