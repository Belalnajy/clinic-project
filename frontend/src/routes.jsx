import { createBrowserRouter } from 'react-router-dom';
import MainLayout from './pages/layouts/MainLayout';
import SettingsPage from './pages/SettingsPage';
import ProfileSettings from './components/settings/ProfileSettings';
import AccountSettings from './components/settings/AccountSettings';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <div>404 Not Found</div>,
    children: [{
      path: "settings",
      element: <SettingsPage />,
      children: [
        { path: "profile", element: <ProfileSettings /> },
        { path: "account", element: <AccountSettings /> },
      ]
    }],
  },
]);

export default router;
