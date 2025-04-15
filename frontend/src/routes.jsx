import { createBrowserRouter } from 'react-router-dom';
import MainLayout from './pages/layouts/MainLayout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <div>404 Not Found</div>,
    children: [],
  },
]);

export default router;
