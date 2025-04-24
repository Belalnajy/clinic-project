import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/Auth/useAuth';

// Define role-based route access
const roleAccess = {
  doctor: [
    '/',
    '/dashboard/doctor',
    '/patients',
    '/patient/:id',
    '/appointments',
    '/settings',
    '/medications',
  ],
  secretary: [
    '/',
    '/dashboard/secretary',
    '/patients',
    '/patient/:id',
    '/appointments',
    '/settings',
  ],
  manager: [
    '/',
    '/dashboard/manager',
    '/patients',
    '/patient/:id',
    '/appointments',
    '/doctors',
    '/reports',
    '/settings',
    '/medications',
  ],
};

export const ProtectedRoute = ({ children, requireAuth = true, allowedRoles = [] }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // If trying to access login page while authenticated
  if (!requireAuth && isAuthenticated) {
    // Redirect to appropriate dashboard based on user role
    const dashboardPath =
      user?.role === 'doctor'
        ? '/dashboard/doctor'
        : user?.role === 'secretary'
        ? '/dashboard/secretary'
        : '/dashboard/manager';

    return <Navigate to={dashboardPath} replace state={{ from: location }} />;
  }

  // If trying to access protected route while not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Check role-based access
  if (requireAuth && isAuthenticated && user?.role) {
    const currentPath = location.pathname;

    // If specific roles are provided, check against them
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      return <Navigate to="/unauthorized" replace state={{ from: location }} />;
    }

    // Check if the current path is allowed for the user's role
    const allowedPaths = roleAccess[user.role] || [];
    const isPathAllowed = allowedPaths.some((path) => {
      // Handle dynamic routes (like /patient/:id)
      if (path.includes(':')) {
        const pathRegex = new RegExp('^' + path.replace(/:[^/]+/g, '[^/]+') + '$');
        return pathRegex.test(currentPath);
      }
      // Handle root path
      if (path === '/' && currentPath === '/') {
        return true;
      }
      return currentPath.startsWith(path);
    });

    if (!isPathAllowed) {
      return <Navigate to="/unauthorized" replace state={{ from: location }} />;
    }
  }

  return children;
};
