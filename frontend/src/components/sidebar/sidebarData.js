// Determine which navigation items to show based on user role

export const getNavItems = (user) => {
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
      path: '/register',
      icon: 'fas fa-user-plus',
      label: 'Add User',
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

  return navItems.filter((item) => item.roles.includes(user.role));
};
