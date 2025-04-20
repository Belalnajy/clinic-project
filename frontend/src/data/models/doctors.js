const doctors = [
  {
    userId: 1, // Foreign Key to Users table
    specialty_id: 1, // Refers to Specialties table (Cardiology)
    licenseNumber: 'C123456789',
    yearsOfExperience: 15,
    qualifications: 'MBBS, MD in Cardiology',
    availability: 'Monday to Friday, 9 AM - 5 PM',
    officeLocation: '123 Heart Clinic, 2nd Floor, New York',
    bio: 'Dr. Sarah Johnson is a seasoned cardiologist with a focus on heart disease prevention.',
    status: 'Active',
    createdAt: '2025-01-01T08:00:00Z',
    updatedAt: '2025-01-01T08:00:00Z',
  },
  {
    userId: 2, // Foreign Key to Users table
    specialty_id: 2, // Refers to Specialties table (Dermatology)
    licenseNumber: 'D987654321',
    yearsOfExperience: 8,
    qualifications: 'MBBS, MD in Dermatology',
    availability: 'Tuesday, Thursday, and Friday, 10 AM - 4 PM',
    officeLocation: '456 Skin Clinic, 3rd Floor, Los Angeles',
    bio: 'Dr. Alice Brown specializes in treating skin conditions, including eczema and acne.',
    status: 'Active',
    createdAt: '2025-01-02T09:00:00Z',
    updatedAt: '2025-01-02T09:00:00Z',
  },
];
