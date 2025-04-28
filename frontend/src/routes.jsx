import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from './pages/layouts/MainLayout';
import SettingsPage from './pages/SettingsPage';
import ProfileSettings from './components/settings/ProfileSettings';
import AccountSettings from './components/settings/AccountSettings';
import ProfessionalSettings from './components/settings/ProfessionalSettings';
import Dashboard from './pages/Dashboard';
import Patients from './pages/patients/Patients';
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
import {
  LabResults,
  MedicalRecords,
  Overview,
  Prescriptions,
} from './components/patient-details/tabs';
import NotFound from './pages/NotFound';
import ActivePatients from './pages/patients/ActivePatients';
import InactivePatients from './pages/patients/InactivePatients';
import PatientForm from './pages/patients/PatientForm';
import AppointmentDetails from './pages/AppointmentDetails';

const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <ProtectedRoute requireAuth={false}>
        <LoginPage />
      </ProtectedRoute>
    ),
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
          { path: 'professional', element: <ProfessionalSettings /> },
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
        element: <Patients />,
        children: [
          {
            index: true,
            element: <Navigate to="active-patients" replace />,
          },
          {
            path: 'active-patients',
            element: <ActivePatients />,
          },
          {
            path: 'inactive-patients',
            element: <InactivePatients />,
          },
          {
            path: 'add',
            element: <PatientForm />,
          },
          {
            path: ':id/edit',
            element: <PatientForm />,
          },
        ],
      },
      {
        path: 'patient/:id',
        element: (
          <ProtectedRoute allowedRoles={['doctor', 'secretary', 'manager']}>
            <PatientDetails />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="overview" replace />,
          },
          {
            path: 'overview',
            element: <Overview />,
          },
          {
            path: 'medical-records',
            element: <MedicalRecords />,
          },
          {
            path: 'prescriptions',
            element: <Prescriptions />,
          },
          {
            path: 'lab-results',
            element: <LabResults />,
          },
        ],
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
        path: '/appointment/:appointmentId',
        element: (
          <ProtectedRoute allowedRoles={['doctor', 'secretary', 'manager']}>
            <AppointmentDetails />
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
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default router;
