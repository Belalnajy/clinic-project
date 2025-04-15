import { v4 as uuidv4 } from 'uuid';
import { format, addDays, subDays } from 'date-fns';

// Initialize local storage with demo data if not already present
export const initializeData = () => {
  // Check if data already exists
  if (!localStorage.getItem('initialized')) {
    // Users
    const users = [
      {
        id: 'manager-1',
        name: 'Alex Johnson',
        email: 'alex@mediclinic.com',
        password: 'password',
        role: 'manager',
        avatar: 'AJ',
      },
      {
        id: 'doctor-1',
        name: 'Dr. Alice Davis',
        email: 'alice@mediclinic.com',
        password: 'password',
        role: 'doctor',
        avatar: 'AD',
      },
      {
        id: 'doctor-2',
        name: 'Dr. Bob Wilson',
        email: 'bob@mediclinic.com',
        password: 'password',
        role: 'doctor',
        avatar: 'BW',
      },
      {
        id: 'doctor-3',
        name: 'Dr. John Doe',
        email: 'john@mediclinic.com',
        password: 'password',
        role: 'doctor',
        avatar: 'JD',
      },
      {
        id: 'secretary-1',
        name: 'Mary Johnson',
        email: 'mary@mediclinic.com',
        password: 'password',
        role: 'secretary',
        avatar: 'MJ',
      },
    ];
    localStorage.setItem('staff', JSON.stringify(users));

    // Patients
    const patients = [
      {
        id: 'P-1001',
        fullName: 'Sarah Mitchell',
        email: 'sarah@example.com',
        phone: '555-123-4567',
        address: '123 Main St, Anytown',
        dateOfBirth: '1985-04-15',
        gender: 'Female',
        medicalHistory: [
          { condition: 'Asthma', diagnosedDate: '2010-06-22' },
          { condition: 'Migraine', diagnosedDate: '2015-03-14' }
        ],
        registrationDate: '2022-01-15',
        insuranceInfo: {
          provider: 'HealthPlus',
          policyNumber: 'HP7890123',
          expiryDate: '2023-12-31'
        }
      },
      {
        id: 'P-0872',
        fullName: 'James Thompson',
        email: 'james@example.com',
        phone: '555-987-6543',
        address: '456 Oak Ave, Somewhere',
        dateOfBirth: '1979-09-28',
        gender: 'Male',
        medicalHistory: [
          { condition: 'Hypertension', diagnosedDate: '2018-11-03' }
        ],
        registrationDate: '2022-02-05',
        insuranceInfo: {
          provider: 'MediCare',
          policyNumber: 'MC4567890',
          expiryDate: '2023-10-15'
        }
      },
      {
        id: 'P-1245',
        fullName: 'Emma Lewis',
        email: 'emma@example.com',
        phone: '555-456-7890',
        address: '789 Pine St, Elsewhere',
        dateOfBirth: '1992-12-03',
        gender: 'Female',
        medicalHistory: [
          { condition: 'Type 2 Diabetes', diagnosedDate: '2019-08-17' },
          { condition: 'Hypertension', diagnosedDate: '2020-02-22' }
        ],
        registrationDate: '2022-03-10',
        insuranceInfo: {
          provider: 'GlobalHealth',
          policyNumber: 'GH1234567',
          expiryDate: '2023-11-30'
        }
      },
      {
        id: 'P-2345',
        fullName: 'John Davis',
        email: 'john.davis@example.com',
        phone: '555-234-5678',
        address: '101 Cedar Rd, Othertown',
        dateOfBirth: '1965-07-21',
        gender: 'Male',
        medicalHistory: [
          { condition: 'Arthritis', diagnosedDate: '2017-05-11' }
        ],
        registrationDate: '2022-04-20',
        insuranceInfo: {
          provider: 'HealthPlus',
          policyNumber: 'HP4561237',
          expiryDate: '2023-09-30'
        }
      },
      {
        id: 'P-3456',
        fullName: 'Amanda Ross',
        email: 'amanda@example.com',
        phone: '555-345-6789',
        address: '202 Birch Dr, Nowhereville',
        dateOfBirth: '1988-01-30',
        gender: 'Female',
        medicalHistory: [
          { condition: 'Diabetes', diagnosedDate: '2016-09-28' }
        ],
        registrationDate: '2022-05-05',
        insuranceInfo: {
          provider: 'MediCare',
          policyNumber: 'MC7654321',
          expiryDate: '2023-08-15'
        }
      }
    ];
    localStorage.setItem('patients', JSON.stringify(patients));

    // Appointments
    const today = new Date();
    const tomorrow = addDays(today, 1);
    
    const appointments = [
      {
        id: uuidv4(),
        patientId: 'P-1001',
        doctorId: 'doctor-1',
        date: format(today, 'yyyy-MM-dd'),
        time: '10:00',
        duration: 45,
        type: 'Check-up',
        status: 'confirmed',
        notes: 'Regular check-up appointment'
      },
      {
        id: uuidv4(),
        patientId: 'P-0872',
        doctorId: 'doctor-2',
        date: format(today, 'yyyy-MM-dd'),
        time: '11:30',
        duration: 30,
        type: 'Consultation',
        status: 'pending',
        notes: 'Initial consultation for persistent headaches'
      },
      {
        id: uuidv4(),
        patientId: 'P-1245',
        doctorId: 'doctor-1',
        date: format(today, 'yyyy-MM-dd'),
        time: '14:15',
        duration: 60,
        type: 'Follow-up',
        status: 'confirmed',
        notes: 'Follow-up on diabetes management'
      },
      {
        id: uuidv4(),
        patientId: 'P-2345',
        doctorId: 'doctor-3',
        date: format(tomorrow, 'yyyy-MM-dd'),
        time: '09:00',
        duration: 30,
        type: 'Check-up',
        status: 'confirmed',
        notes: 'Regular check-up appointment'
      },
      {
        id: uuidv4(),
        patientId: 'P-3456',
        doctorId: 'doctor-1',
        date: format(tomorrow, 'yyyy-MM-dd'),
        time: '13:30',
        duration: 45,
        type: 'Follow-up',
        status: 'confirmed',
        notes: 'Follow-up on recent lab results'
      }
    ];
    localStorage.setItem('appointments', JSON.stringify(appointments));

    // Medical Records
    const medicalRecords = [
      {
        id: uuidv4(),
        patientId: 'P-2345',
        doctorId: 'doctor-3',
        date: format(subDays(today, 1), 'yyyy-MM-dd'),
        diagnoses: ['Mild Hypertension'],
        symptoms: ['Headache', 'Dizziness'],
        notes: 'Diagnosed with mild hypertension. Prescribed Amlodipine 5mg once daily.',
        prescriptions: [
          {
            medication: 'Amlodipine',
            dosage: '5mg',
            frequency: 'Once daily',
            duration: '30 days'
          }
        ],
        testResults: [],
        attachments: []
      },
      {
        id: uuidv4(),
        patientId: 'P-3456',
        doctorId: 'doctor-1',
        date: format(subDays(today, 2), 'yyyy-MM-dd'),
        diagnoses: ['Type 2 Diabetes'],
        symptoms: ['Fatigue', 'Excessive thirst'],
        notes: 'Follow-up for diabetes management. A1C levels improved to 6.8%. Continuing with current regimen.',
        prescriptions: [
          {
            medication: 'Metformin',
            dosage: '500mg',
            frequency: 'Twice daily',
            duration: '90 days'
          }
        ],
        testResults: [
          {
            name: 'A1C',
            value: '6.8%',
            date: format(subDays(today, 2), 'yyyy-MM-dd'),
            normalRange: '4.0% - 5.6%'
          }
        ],
        attachments: []
      }
    ];
    localStorage.setItem('medicalRecords', JSON.stringify(medicalRecords));

    // Tasks
    const tasks = [
      {
        id: uuidv4(),
        userId: 'doctor-3',
        title: 'Review lab results for Emma Lewis',
        description: 'Review recent blood work and adjust treatment plan if necessary',
        dueDate: format(today, 'yyyy-MM-dd'),
        status: 'pending',
        priority: 'high'
      },
      {
        id: uuidv4(),
        userId: 'doctor-3',
        title: 'Follow up with James Thompson',
        description: 'Call to check on medication side effects',
        dueDate: format(tomorrow, 'yyyy-MM-dd'),
        status: 'pending',
        priority: 'medium'
      },
      {
        id: uuidv4(),
        userId: 'doctor-3',
        title: 'Complete monthly reports',
        description: 'Finish patient outcome reports for clinic manager',
        dueDate: format(addDays(today, 3), 'yyyy-MM-dd'),
        status: 'pending',
        priority: 'medium'
      }
    ];
    localStorage.setItem('tasks', JSON.stringify(tasks));

    // Reminders
    const reminders = [
      {
        id: uuidv4(),
        userId: 'secretary-1',
        title: 'Call Mark Wilson',
        description: 'Appointment confirmation for tomorrow',
        dueDate: format(today, 'yyyy-MM-dd'),
        priority: 'medium'
      },
      {
        id: uuidv4(),
        userId: 'secretary-1',
        title: 'Send lab results to Dr. Alice',
        description: 'For patient Emma Lewis',
        dueDate: format(today, 'yyyy-MM-dd'),
        priority: 'urgent'
      },
      {
        id: uuidv4(),
        userId: 'secretary-1',
        title: 'Update insurance information',
        description: 'For patient James Thompson',
        dueDate: format(tomorrow, 'yyyy-MM-dd'),
        priority: 'low'
      }
    ];
    localStorage.setItem('reminders', JSON.stringify(reminders));

    // Set flag that initialization has been done
    localStorage.setItem('initialized', 'true');
  }
};

// Stats generators - these functions return calculated statistics based on the stored data
export const generateDashboardStats = () => {
  const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
  const patients = JSON.parse(localStorage.getItem('patients') || '[]');
  const today = format(new Date(), 'yyyy-MM-dd');
  
  const appointmentsToday = appointments.filter(app => app.date === today).length;
  const totalPatients = patients.length;
  const pendingAppointments = appointments.filter(app => app.status === 'pending').length;
  const completedToday = appointments.filter(app => app.date === today && app.status === 'completed').length;
  
  return {
    appointmentsToday,
    totalPatients,
    pendingAppointments,
    completedToday
  };
};

export const generateRevenueData = () => {
  // In a real app, this would be based on actual appointment and billing data
  // This is just mock data for demonstration
  return [
    { name: 'Monday', revenue: 3500 },
    { name: 'Tuesday', revenue: 4200 },
    { name: 'Wednesday', revenue: 3800 },
    { name: 'Thursday', revenue: 4500 },
    { name: 'Friday', revenue: 5100 },
    { name: 'Saturday', revenue: 2800 },
    { name: 'Sunday', revenue: 1200 },
  ];
};

export const generateStaffPerformance = () => {
  const staff = JSON.parse(localStorage.getItem('staff') || '[]');
  const doctors = staff.filter(user => user.role === 'doctor');
  
  return doctors.map(doctor => ({
    id: doctor.id,
    name: doctor.name,
    avatar: doctor.avatar,
    performance: Math.floor(70 + Math.random() * 30) // Random performance between 70-100%
  }));
};

export const getTodayAppointments = () => {
  const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
  const patients = JSON.parse(localStorage.getItem('patients') || '[]');
  const staff = JSON.parse(localStorage.getItem('staff') || '[]');
  const today = format(new Date(), 'yyyy-MM-dd');
  
  const todaysAppointments = appointments
    .filter(app => app.date === today)
    .map(appointment => {
      const patient = patients.find(p => p.id === appointment.patientId);
      const doctor = staff.find(d => d.id === appointment.doctorId);
      
      return {
        ...appointment,
        patientName: patient ? patient.fullName : 'Unknown Patient',
        patientId: patient ? patient.id : 'Unknown',
        patientAvatar: patient ? patient.fullName.split(' ').map(n => n[0]).join('') : 'UK',
        doctorName: doctor ? doctor.name : 'Unknown Doctor'
      };
    });
  
  return todaysAppointments;
};

export const getRecentPatientRecords = () => {
  const medicalRecords = JSON.parse(localStorage.getItem('medicalRecords') || '[]');
  const patients = JSON.parse(localStorage.getItem('patients') || '[]');
  
  // Sort records by date (most recent first) and take the top 5
  const recentRecords = [...medicalRecords]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)
    .map(record => {
      const patient = patients.find(p => p.id === record.patientId);
      
      return {
        ...record,
        patientName: patient ? patient.fullName : 'Unknown Patient',
        patientAvatar: patient ? patient.fullName.split(' ').map(n => n[0]).join('') : 'UK',
        timeAgo: '10 min ago' // In a real app, would calculate this from the date
      };
    });
  
  return recentRecords;
};

export const getRecentRegistrations = () => {
  const patients = JSON.parse(localStorage.getItem('patients') || '[]');
  
  // Sort patients by registration date (most recent first) and take the top 3
  const recentRegistrations = [...patients]
    .sort((a, b) => new Date(b.registrationDate) - new Date(a.registrationDate))
    .slice(0, 3)
    .map(patient => ({
      id: patient.id,
      name: patient.fullName,
      avatar: patient.fullName.split(' ').map(n => n[0]).join(''),
      registeredDate: patient.registrationDate,
      // In a real app, we would calculate a relative time here
      registeredTimeDescription: 'Registered today'
    }));
  
  return recentRegistrations;
};
