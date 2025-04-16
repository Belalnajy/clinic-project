import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./pages/layouts/MainLayout";
import Dashboard from "./pages/Dashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <div>404 Not Found1</div>,
    children: []
  },
  {
    path: "dashboard",
    element: <Dashboard />
  }
]);

export default router;
