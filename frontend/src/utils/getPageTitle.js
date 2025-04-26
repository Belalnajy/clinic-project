// Determine page title based on current path
export const getPageTitle = (path) => {
  if (path.includes('/dashboard')) {
    return 'Dashboard';
  } else if (path.includes('/patients')) {
    return 'Patients';
  } else if (path.includes('/appointments')) {
    return 'Appointments';
  } else if (path.includes('/doctors')) {
    return 'Doctors';
  } else if (path.includes('/reports')) {
    return 'Reports';
  } else if (path.includes('/settings')) {
    return 'Settings';
  } else if (path.includes('/ai-assistant')) {
    return 'AI Assistant';
  } else if (path.includes('/specializations')) {
    return 'Specializations';
  }
  return 'Dashboard';
};
