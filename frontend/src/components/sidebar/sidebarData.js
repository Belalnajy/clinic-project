//! For Testing
export const user = {
  id: 'doctor-1',
  name: 'Dr. Alice Davis',
  email: 'alice@mediclinic.com',
  password: 'password',
  role: 'doctor',
  avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2',
};

// Determine which navigation items to show based on user role
const navItems = [
  {
    path: `/dashboard/${user.role}`,
    icon: 'fas fa-home',
    label: 'Dashboard',
    roles: ['manager', 'doctor', 'secretary'],
  },
  {
    path: '/patients',
    icon: 'fas fa-user-injured',
    label: 'Patients',
    roles: ['manager', 'doctor', 'secretary'],
  },
  {
    path: '/appointments',
    icon: 'fas fa-calendar-alt',
    label: 'Appointments',
    roles: ['manager', 'doctor', 'secretary'],
  },
  {
    path: '/doctors',
    icon: 'fas fa-user-md',
    label: 'Doctors',
    roles: ['manager'],
  },
  {
    path: '/reports',
    icon: 'fas fa-chart-bar',
    label: 'Reports',
    roles: ['manager', 'doctor'],
  },
  {
    path: '/settings',
    icon: 'fas fa-cog',
    label: 'Settings',
    roles: ['manager', 'doctor', 'secretary'],
  },
];

export const getNavItems = () => {
  return navItems.filter((item) => item.roles.includes(user.role));
};
