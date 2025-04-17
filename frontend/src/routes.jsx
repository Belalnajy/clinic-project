import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "./pages/layouts/MainLayout";
import SettingsPage from "./pages/SettingsPage";
import ProfileSettings from "./components/settings/ProfileSettings";
import AccountSettings from "./components/settings/AccountSettings";
import Dashboard from "./pages/Dashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <div>404 Not Found</div>,
    children: [
      {
        path: "settings",
        element: <SettingsPage />,
        children: [
          { index: true, element: <Navigate to="profile" replace /> },
          { path: "profile", element: <ProfileSettings /> },
          { path: "account", element: <AccountSettings /> }
        ]
      },
      { path: "dashboard/:role", element: <Dashboard /> }
    ]
  }
]);

export default router;
