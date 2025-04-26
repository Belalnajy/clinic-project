// Determine which navigation items to show based on user role
import {
  Home,
  Calendar,
  Users,
  Pill,
  BarChart3,
  Stethoscope,
  Settings,
  UserRoundPlus,
  GraduationCap,
} from 'lucide-react';
const navItems = [
  {
    path: '/dashboard/manager',
    label: 'Dashboard',
    icon: Home,
    allowedRoles: ['manager'],
  },
  {
    path: '/dashboard/doctor',
    label: 'Dashboard',
    icon: Home,
    allowedRoles: ['doctor'],
  },
  {
    path: '/dashboard/secretary',
    label: 'Dashboard',
    icon: Home,
    allowedRoles: ['secretary'],
  },
  {
    path: '/appointments',
    label: 'Appointments',
    icon: Calendar,
    allowedRoles: ['manager', 'doctor', 'secretary'],
  },
  {
    path: '/patients',
    label: 'Patients',
    icon: Users,
    allowedRoles: ['manager', 'doctor', 'secretary'],
  },
  {
    path: '/medications',
    label: 'Medications',
    icon: Pill,
    allowedRoles: ['manager', 'doctor'],
  },
  {
    path: '/reports',
    label: 'Reports',
    icon: BarChart3,
    allowedRoles: ['manager'],
  },
  {
    path: '/doctors',
    label: 'Doctors',
    icon: Stethoscope,
    allowedRoles: ['manager'],
  },
  {
    path: '/specializations',
    label: 'Specializations',
    icon: GraduationCap,
    allowedRoles: ['manager'],
  },
  {
    path: '/register',
    icon: UserRoundPlus,
    label: 'Add User',
    allowedRoles: ['manager'],
  },
  {
    path: '/settings',
    label: 'Settings',
    icon: Settings,
    allowedRoles: ['manager', 'doctor', 'secretary'],
  },
  {
    path: '/ai-assistant',
    label: 'AI Assistant',
    icon: Stethoscope,
    allowedRoles: ['manager', 'doctor', 'secretary'],
  },
];

export const getNavItems = (user) => {
  return navItems.filter((item) => item.allowedRoles.includes(user?.role));
};
