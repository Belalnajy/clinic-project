const sampleUsers = [
  {
    id: 1,
    username: 'manager',
    password: 'password',
    name: 'Dr. Sarah Johnson',
    role: 'manager',
    email: 'sarah.johnson@clinic.com',
    phone: '555-123-4567',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    specialization: 'Neurology',
  },
  {
    id: 2,
    username: 'doctor',
    password: 'password',
    name: 'Dr. Emily Chen',
    role: 'doctor',
    email: 'emily.chen@clinic.com',
    phone: '555-234-5678',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2',
    specialization: 'Cardiology',
  },
  {
    id: 3,
    username: 'secretary',
    password: 'password',
    name: 'John Smith',
    role: 'secretary',
    email: 'john.smith@clinic.com',
    phone: '555-345-6789',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    specialization: '',
  },
];

export function initializeUsers() {
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify(sampleUsers));
  }
}

export function getUsers() {
  const users = localStorage.getItem('users');
  return users ? JSON.parse(users) : [];
}
