// Initialize default data if local storage is empty

// Generate Patient ID (Format: PA-XXXXX)
const generatePatientId = () => {
  const randomNum = Math.floor(10000 + Math.random() * 90000); // 5-digit number
  return `PA-${randomNum}`;
};

// Initialize sample patients if not exists
const initializePatients = () => {
  if (!localStorage.getItem('patients')) {
    const patients = [
      {
        id: 1,
        patientId: 'PA-10385',
        firstName: 'James',
        lastName: 'Wilson',
        dateOfBirth: '1978-07-15',
        gender: 'Male',
        email: 'james.wilson@example.com',
        phone: '555-876-1234',
        address: '123 Oak Street',
        city: 'Springfield',
        postalCode: '12345',
        emergencyContact: 'Sarah Wilson: 555-876-5678',
        createdAt: '2023-01-15T09:30:00',
        createdBy: 3
      },
      {
        id: 2,
        patientId: 'PA-10326',
        firstName: 'Maria',
        lastName: 'Garcia',
        dateOfBirth: '1985-03-22',
        gender: 'Female',
        email: 'maria.garcia@example.com',
        phone: '555-234-5678',
        address: '456 Pine Avenue',
        city: 'Springfield',
        postalCode: '12345',
        emergencyContact: 'Carlos Garcia: 555-234-9876',
        createdAt: '2023-02-10T14:15:00',
        createdBy: 3
      },
      {
        id: 3,
        patientId: 'PA-10390',
        firstName: 'Robert',
        lastName: 'Johnson',
        dateOfBirth: '1966-11-05',
        gender: 'Male',
        email: 'robert.johnson@example.com',
        phone: '555-345-6789',
        address: '789 Maple Drive',
        city: 'Springfield',
        postalCode: '12345',
        emergencyContact: 'Mary Johnson: 555-345-9876',
        createdAt: '2023-03-05T11:45:00',
        createdBy: 3
      },
      {
        id: 4,
        patientId: 'PA-10412',
        firstName: 'Elizabeth',
        lastName: 'Brown',
        dateOfBirth: '1972-09-12',
        gender: 'Female',
        email: 'elizabeth.brown@example.com',
        phone: '555-456-7890',
        address: '101 Elm Street',
        city: 'Springfield',
        postalCode: '12345',
        emergencyContact: 'David Brown: 555-456-9876',
        createdAt: '2023-04-20T10:30:00',
        createdBy: 3
      }
    ];
    localStorage.setItem('patients', JSON.stringify(patients));
  }
};

// Initialize sample appointments if not exists
const initializeAppointments = () => {
  if (!localStorage.getItem('appointments')) {
    const appointments = [
      {
        id: 1,
        patientId: 1,
        doctorId: 2,
        date: '2023-06-15',
        time: '09:00',
        duration: 45,
        status: 'confirmed',
        notes: 'Regular checkup',
        createdAt: '2023-06-10T11:30:00',
        createdBy: 3
      },
      {
        id: 2,
        patientId: 2,
        doctorId: 1,
        date: '2023-06-15',
        time: '10:30',
        duration: 30,
        status: 'pending',
        notes: 'Follow-up appointment',
        createdAt: '2023-06-11T09:45:00',
        createdBy: 3
      },
      {
        id: 3,
        patientId: 3,
        doctorId: 2,
        date: '2023-06-15',
        time: '11:15',
        duration: 60,
        status: 'in-progress',
        notes: 'New symptoms discussion',
        createdAt: '2023-06-12T14:20:00',
        createdBy: 3
      },
      {
        id: 4,
        patientId: 4,
        doctorId: 1,
        date: '2023-06-15',
        time: '13:30',
        duration: 45,
        status: 'cancelled',
        notes: 'Annual physical',
        createdAt: '2023-06-13T16:10:00',
        createdBy: 3
      }
    ];
    localStorage.setItem('appointments', JSON.stringify(appointments));
  }
};

// Initialize doctors list if not exists
const initializeDoctors = () => {
  if (!localStorage.getItem('doctors')) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const doctors = users.filter(user => user.role === 'doctor' || user.role === 'manager');

    // Add additional doctors to the list
    const additionalDoctors = [
      {
        id: 4,
        username: 'doctor2',
        name: 'Dr. Mark Williams',
        role: 'doctor',
        email: 'mark.williams@clinic.com',
        phone: '555-456-7890',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
        specialization: 'General'
      },
      {
        id: 5,
        username: 'doctor3',
        name: 'Dr. Jessica Lee',
        role: 'doctor',
        email: 'jessica.lee@clinic.com',
        phone: '555-567-8901',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
        specialization: 'Dermatology'
      }
    ];

    const allDoctors = [...doctors, ...additionalDoctors];
    localStorage.setItem('doctors', JSON.stringify(allDoctors));
  }
};

// Initialize medical records if not exists
const initializeMedicalRecords = () => {
  if (!localStorage.getItem('medicalRecords')) {
    const medicalRecords = [
      {
        id: 1,
        patientId: 1,
        doctorId: 2,
        appointmentId: 1,
        diagnosis: 'Hypertension',
        prescriptions: [
          { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily' }
        ],
        notes: 'Patient should monitor blood pressure daily and maintain low sodium diet',
        createdAt: '2023-06-15T09:45:00'
      },
      {
        id: 2,
        patientId: 3,
        doctorId: 1,
        appointmentId: 3,
        diagnosis: 'Migraine',
        prescriptions: [
          { name: 'Sumatriptan', dosage: '50mg', frequency: 'As needed for migraines' }
        ],
        notes: 'Patient should avoid triggers and keep a headache journal',
        createdAt: '2023-06-15T12:15:00'
      }
    ];
    localStorage.setItem('medicalRecords', JSON.stringify(medicalRecords));
  }
};

// Initialize chat messages if not exists
const initializeChatMessages = () => {
  if (!localStorage.getItem('chatMessages')) {
    const chatMessages = {
      'manager': [
        { sender: 'ai', message: 'Hello Dr. Johnson, how can I assist you today?' },
        { sender: 'user', message: 'Give me a summary of today\'s appointments.' },
        { sender: 'ai', message: 'You have 24 appointments scheduled for today. 18 are confirmed, 4 are pending confirmation, 1 is in progress, and 1 has been cancelled. The busiest time is between 9AM and 12PM with 14 appointments.' }
      ],
      'doctor': [
        { sender: 'ai', message: 'Hello Dr. Chen, how can I assist you today?' },
        { sender: 'user', message: 'Show me the medical history for James Wilson.' },
        { sender: 'ai', message: 'James Wilson (PA-10385) has a history of hypertension diagnosed on June 15, 2023. He is currently taking Lisinopril 10mg once daily. His last visit was for a regular checkup where his blood pressure was recorded at 130/85 mmHg.' }
      ],
      'secretary': [
        { sender: 'ai', message: 'Hello John, how can I assist you today?' },
        { sender: 'user', message: 'How many appointments do we have scheduled for tomorrow?' },
        { sender: 'ai', message: 'There are 18 appointments scheduled for tomorrow. Would you like me to list them or provide a summary by doctor?' }
      ]
    };
    localStorage.setItem('chatMessages', JSON.stringify(chatMessages));
  }
};

// Statistics data
const getStatistics = (userRole) => {
  const baseStats = {
    patients: 2537,
    patientGrowth: '12%',
    appointments: 24,
    appointmentGrowth: '8%',
    availableDoctors: 6,
    doctorChangePercent: 2,
    revenue: '$12,450',
    revenueGrowth: '18%',
  };

  // Role-specific adjustments to stats could be made here
  // For example, secretary might not see revenue data
  if (userRole === 'secretary') {
    return {
      ...baseStats,
      revenue: '-',
      revenueGrowth: '-',
    };
  }

  return baseStats;
};

// Initialize staff data if not exists
const initializeStaff = () => {
  if (!localStorage.getItem('staff')) {
    const staff = [
      {
        id: 1,
        name: 'Dr. Emily Chen',
        role: 'doctor',
        department: 'Cardiology',
        specialty: 'Cardiology',
        email: 'emily.chen@clinic.com',
        phone: '555-111-2233',
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2',
        status: 'With Patient',
        patients: 42,
        rating: 4.9,
        efficiency: 94,
        dateJoined: '2021-02-15'
      },
      {
        id: 2,
        name: 'Dr. Mark Williams',
        role: 'doctor',
        department: 'General Medicine',
        specialty: 'General Medicine',
        email: 'mark.williams@clinic.com',
        phone: '555-222-3344',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
        status: 'Available',
        patients: 36,
        rating: 4.7,
        efficiency: 86,
        dateJoined: '2021-05-10'
      },
      {
        id: 3,
        name: 'Dr. Jessica Lee',
        role: 'doctor',
        department: 'Dermatology',
        specialty: 'Dermatology',
        email: 'jessica.lee@clinic.com',
        phone: '555-333-4455',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
        status: 'On Break',
        patients: 28,
        rating: 4.8,
        efficiency: 90,
        dateJoined: '2022-01-20'
      },
      {
        id: 4,
        name: 'John Smith',
        role: 'secretary',
        department: 'Administration',
        specialty: 'N/A',
        email: 'john.smith@clinic.com',
        phone: '555-444-5566',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
        status: 'Available',
        patients: 16,
        rating: 4.6,
        efficiency: 92,
        dateJoined: '2022-03-15'
      },
      {
        id: 5,
        name: 'Dr. Sarah Johnson',
        role: 'doctor',
        department: 'Neurology',
        specialty: 'Neurology',
        email: 'sarah.johnson@clinic.com',
        phone: '555-555-6677',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
        status: 'With Patient',
        patients: 32,
        rating: 4.9,
        efficiency: 95,
        dateJoined: '2021-09-05'
      },
      {
        id: 6,
        name: 'Maria Rodriguez',
        role: 'nurse',
        department: 'General Medicine',
        specialty: 'N/A',
        email: 'maria.rodriguez@clinic.com',
        phone: '555-666-7788',
        avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce',
        status: 'Available',
        patients: 0,
        rating: 4.8,
        efficiency: 90,
        dateJoined: '2022-05-10'
      },
      {
        id: 7,
        name: 'Robert Taylor',
        role: 'secretary',
        department: 'Outpatient',
        specialty: 'N/A',
        email: 'robert.taylor@clinic.com',
        phone: '555-777-8899',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
        status: 'Available',
        patients: 0,
        rating: 4.5,
        efficiency: 88,
        dateJoined: '2022-06-15'
      }
    ];
    localStorage.setItem('staff', JSON.stringify(staff));
  }
};

// Initialize all data
const initializeAllData = () => {
  initializePatients();
  initializeAppointments();
  initializeDoctors();
  initializeMedicalRecords();
  initializeChatMessages();
  initializeStaff();
};

// Data access functions
const getAllPatients = () => {
  return JSON.parse(localStorage.getItem('patients') || '[]');
};

const getPatientById = (id) => {
  const patients = getAllPatients();
  return patients.find(p => p.id === id);
};

const addPatient = (patientData) => {
  const patients = getAllPatients();
  const newId = patients.length > 0 ? Math.max(...patients.map(p => p.id)) + 1 : 1;
  const newPatient = {
    ...patientData,
    id: generatePatientId(),
    patientId: generatePatientId(),
    createdAt: new Date().toISOString()
  };

  patients.push(newPatient);
  localStorage.setItem('patients', JSON.stringify(patients));
  return newPatient;
};

const updatePatient = (id, patientData) => {
  const patients = getAllPatients();
  const index = patients.findIndex(p => p.id === id);
  if (index !== -1) {
    patients[index] = { ...patients[index], ...patientData };
    localStorage.setItem('patients', JSON.stringify(patients));
    return patients[index];
  }
  return null;
};

const deletePatient = (id) => {
  const patients = getAllPatients();
  const filteredPatients = patients.filter(p => p.id !== id);
  localStorage.setItem('patients', JSON.stringify(filteredPatients));
  return true;
};

const getAllAppointments = () => {
  return JSON.parse(localStorage.getItem('appointments') || '[]');
};

const getAppointmentById = (id) => {
  const appointments = getAllAppointments();
  return appointments.find(a => a.id === id);
};

const addAppointment = (appointmentData) => {
  const appointments = getAllAppointments();
  const newId = appointments.length > 0 ? Math.max(...appointments.map(a => a.id)) + 1 : 1;
  const newAppointment = {
    ...appointmentData,
    id: newId,
    createdAt: new Date().toISOString()
  };

  appointments.push(newAppointment);
  localStorage.setItem('appointments', JSON.stringify(appointments));
  return newAppointment;
};

const updateAppointment = (id, appointmentData) => {
  const appointments = getAllAppointments();
  const index = appointments.findIndex(a => a.id === id);
  if (index !== -1) {
    appointments[index] = { ...appointments[index], ...appointmentData };
    localStorage.setItem('appointments', JSON.stringify(appointments));
    return appointments[index];
  }
  return null;
};

const deleteAppointment = (id) => {
  const appointments = getAllAppointments();
  const filteredAppointments = appointments.filter(a => a.id !== id);
  localStorage.setItem('appointments', JSON.stringify(filteredAppointments));
  return true;
};

const getAllDoctors = () => {
  const staff = JSON.parse(localStorage.getItem('staff') || '[]');
  const doctors = staff.filter(s => s.role === 'doctor');
  return doctors;
};

const getDoctorById = (id) => {
  const doctors = getAllDoctors();
  return doctors.find(d => d.id === id);
};

const getChatHistory = (userRole) => {
  const allChats = JSON.parse(localStorage.getItem('chatMessages') || '{}');
  return allChats[userRole] || [];
};

const addChatMessage = (userRole, message, sender) => {
  const allChats = JSON.parse(localStorage.getItem('chatMessages') || '{}');
  if (!allChats[userRole]) {
    allChats[userRole] = [];
  }

  allChats[userRole].push({ sender, message });
  localStorage.setItem('chatMessages', JSON.stringify(allChats));
  return allChats[userRole];
};

const aiResponseGenerator = (userRole, message) => {
  // Simple AI response generator - in a real app this would be a more sophisticated system
  let response = "I'm sorry, I don't understand that question.";

  const lowerMsg = message.toLowerCase();

  if (lowerMsg.includes('appointment') && (lowerMsg.includes('today') || lowerMsg.includes('schedule'))) {
    response = `You have 24 appointments scheduled for today. 18 are confirmed, 4 are pending confirmation, 1 is in progress, and 1 has been cancelled.`;
  } else if (lowerMsg.includes('patient') && lowerMsg.includes('new')) {
    response = `5 new patients were registered this week. Would you like to see their details?`;
  } else if (lowerMsg.includes('report') || lowerMsg.includes('stat')) {
    if (userRole === 'manager') {
      response = `Clinic performance for the last 7 days: 92% appointment completion rate, 4.8/5 patient satisfaction score, and $12,450 in revenue.`;
    } else if (userRole === 'doctor') {
      response = `Your performance for the last 7 days: 34 patients seen, 95% appointment completion rate, and 4.9/5 patient satisfaction score.`;
    } else {
      response = `Front desk performance for the last 7 days: 57 patients checked in, average wait time of 12 minutes, 24 new patients registered.`;
    }
  } else if (lowerMsg.includes('help')) {
    response = `You can ask me about appointments, patient information, statistics, and reports. How can I assist you today?`;
  }

  return response;
};

// Get staff performance data
const getStaffPerformance = () => {
  return [
    {
      id: 1,
      name: 'Dr. Emily Chen',
      role: 'Cardiologist',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2',
      patients: 42,
      rating: 4.9,
      efficiency: 94,
      status: 'With Patient'
    },
    {
      id: 2,
      name: 'Dr. Mark Williams',
      role: 'General Physician',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
      patients: 36,
      rating: 4.7,
      efficiency: 86,
      status: 'Available'
    },
    {
      id: 3,
      name: 'Dr. Jessica Lee',
      role: 'Dermatologist',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
      patients: 28,
      rating: 4.8,
      efficiency: 90,
      status: 'On Break'
    },
    {
      id: 4,
      name: 'John Smith',
      role: 'Secretary',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
      patients: 16,
      rating: 4.6,
      efficiency: 92,
      status: 'Available'
    },
    {
      id: 5,
      name: 'Dr. Sarah Johnson',
      role: 'Neurologist',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
      patients: 32,
      rating: 4.9,
      efficiency: 95,
      status: 'With Patient'
    }
  ];
};

// Get revenue data for charts
const getRevenueData = () => {
  return [
    { month: 'Jan', thisYear: 20000, lastYear: 18000 },
    { month: 'Feb', thisYear: 22000, lastYear: 19000 },
    { month: 'Mar', thisYear: 25000, lastYear: 21000 },
    { month: 'Apr', thisYear: 27000, lastYear: 22000 },
    { month: 'May', thisYear: 30000, lastYear: 24000 },
    { month: 'Jun', thisYear: 35000, lastYear: 26000 },
    { month: 'Jul', thisYear: 40000, lastYear: 28000 },
    { month: 'Aug', thisYear: 42000, lastYear: 30000 },
    { month: 'Sep', thisYear: 43000, lastYear: 31000 },
    { month: 'Oct', thisYear: 45000, lastYear: 33000 },
    { month: 'Nov', thisYear: 47000, lastYear: 35000 },
    { month: 'Dec', thisYear: 50000, lastYear: 38000 }
  ];
};

// Get recent registrations
const getRecentRegistrations = () => {
  return [
    {
      id: 1,
      name: 'Michael Roberts',
      date: '2023-06-12',
      age: 45,
      phone: '555-123-4567',
      insurance: true,
      registeredBy: 'John Smith'
    },
    {
      id: 2,
      name: 'Sofia Hernandez',
      date: '2023-06-10',
      age: 32,
      phone: '555-234-5678',
      insurance: true,
      registeredBy: 'John Smith'
    },
    {
      id: 3,
      name: 'David Lee',
      date: '2023-06-08',
      age: 57,
      phone: '555-345-6789',
      insurance: false,
      registeredBy: 'John Smith'
    },
    {
      id: 4,
      name: 'Emma Wilson',
      date: '2023-06-07',
      age: 28,
      phone: '555-456-7890',
      insurance: true,
      registeredBy: 'John Smith'
    }
  ];
};

// Get today's appointments with more details
const getTodayAppointments = () => {
  return [
    {
      id: 1,
      time: '09:00 AM',
      patientName: 'James Wilson',
      patientId: 'PA-10385',
      patientAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      reason: 'Annual Checkup',
      status: 'completed',
      notes: 'Patient reported improved sleep after medication change'
    },
    {
      id: 2,
      time: '10:30 AM',
      patientName: 'Maria Garcia',
      patientId: 'PA-10326',
      patientAvatar: 'https://randomuser.me/api/portraits/women/28.jpg',
      reason: 'Follow-up',
      status: 'waiting',
      notes: 'Blood pressure check after med adjustment'
    },
    {
      id: 3,
      time: '11:15 AM',
      patientName: 'Robert Johnson',
      patientId: 'PA-10390',
      patientAvatar: 'https://randomuser.me/api/portraits/men/45.jpg',
      reason: 'Migraine Consultation',
      status: 'in-progress',
      notes: 'New treatment plan discussion'
    },
    {
      id: 4,
      time: '01:30 PM',
      patientName: 'Elizabeth Brown',
      patientId: 'PA-10412',
      patientAvatar: 'https://randomuser.me/api/portraits/women/36.jpg',
      reason: 'Vaccination',
      status: 'cancelled',
      notes: 'Patient requested to reschedule'
    },
    {
      id: 5,
      time: '02:45 PM',
      patientName: 'Michael Zhang',
      patientId: 'PA-10456',
      patientAvatar: 'https://randomuser.me/api/portraits/men/54.jpg',
      reason: 'Diabetes Review',
      status: 'waiting',
      notes: 'Review A1C results and medication'
    },
    {
      id: 6,
      time: '03:30 PM',
      patientName: 'Sofia Rodriguez',
      patientId: 'PA-10478',
      patientAvatar: 'https://randomuser.me/api/portraits/women/42.jpg',
      reason: 'Prenatal Checkup',
      status: 'waiting',
      notes: '28-week checkup, ultrasound scheduled'
    },
    {
      id: 7,
      time: '04:15 PM',
      patientName: 'David Chen',
      patientId: 'PA-10495',
      patientAvatar: 'https://randomuser.me/api/portraits/men/38.jpg',
      reason: 'Allergies',
      status: 'waiting',
      notes: 'Seasonal allergy assessment'
    },
    {
      id: 8,
      time: '05:00 PM',
      patientName: 'Emily Washington',
      patientId: 'PA-10512',
      patientAvatar: 'https://randomuser.me/api/portraits/women/24.jpg',
      reason: 'Blood Test Results',
      status: 'waiting',
      notes: 'Review recent blood work from lab'
    }
  ];
};

// Get staff members
const getStaff = () => {
  // Initialize staff data if not exists
  initializeStaff();
  return JSON.parse(localStorage.getItem('staff') || '[]');
};

// Add a new staff member
const addStaff = (staffData) => {
  const staff = getStaff();
  const newId = staff.length > 0 ? Math.max(...staff.map(s => s.id)) + 1 : 1;
  const newStaffMember = {
    ...staffData,
    id: newId
  };

  staff.push(newStaffMember);
  localStorage.setItem('staff', JSON.stringify(staff));
  return staff;
};

// Update a staff member
const updateStaff = (id, staffData) => {
  const staff = getStaff();
  const index = staff.findIndex(s => s.id === id);
  if (index !== -1) {
    staff[index] = { ...staff[index], ...staffData };
    localStorage.setItem('staff', JSON.stringify(staff));
    return staff[index];
  }
  return null;
};

// Delete a staff member
const deleteStaff = (id) => {
  const staff = getStaff();
  const filteredStaff = staff.filter(s => s.id !== id);
  localStorage.setItem('staff', JSON.stringify(filteredStaff));
  return filteredStaff;
};

// Get recent patient medical records
const getRecentPatientRecords = () => {
  return [
    {
      id: 1,
      patientName: 'James Wilson',
      patientId: 'PA-10385',
      patientAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      date: '2023-06-12',
      diagnosis: 'Hypertension Stage 1',
      treatment: 'Lifestyle modifications and medication adjustment',
      prescription: 'Lisinopril 10mg daily, morning\nHydrochlorothiazide 12.5mg daily, morning'
    },
    {
      id: 2,
      patientName: 'Maria Garcia',
      patientId: 'PA-10326',
      patientAvatar: 'https://randomuser.me/api/portraits/women/28.jpg',
      date: '2023-06-10',
      diagnosis: 'Chronic Migraine',
      treatment: 'Preventive therapy and abortive medication',
      prescription: 'Propranolol 40mg twice daily\nSumatriptan 50mg as needed for acute migraine'
    },
    {
      id: 3,
      patientName: 'Robert Johnson',
      patientId: 'PA-10390',
      patientAvatar: 'https://randomuser.me/api/portraits/men/45.jpg',
      date: '2023-06-08',
      diagnosis: 'Type 2 Diabetes',
      treatment: 'Dietary changes, exercise plan, and medication',
      prescription: 'Metformin 500mg twice daily with meals'
    }
  ];
};

const getAllSpecializations = () => {
  return JSON.parse(localStorage.getItem('specializations') || '[]');
};

export {
  initializeAllData,
  getAllPatients,
  getPatientById,
  addPatient,
  updatePatient,
  deletePatient,
  getAllAppointments,
  getAppointmentById,
  addAppointment,
  updateAppointment,
  deleteAppointment,
  getAllDoctors,
  getDoctorById,
  getChatHistory,
  addChatMessage,
  aiResponseGenerator,
  getStatistics,
  getStaffPerformance,
  getRevenueData,
  getRecentRegistrations,
  getTodayAppointments,
  getRecentPatientRecords,
  getStaff,
  addStaff,
  updateStaff,
  deleteStaff,
  getAllSpecializations
};
