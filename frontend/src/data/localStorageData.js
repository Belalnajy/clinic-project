// Local storage utility functions for the clinic management system

// User
export const getStoredUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const setStoredUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

// Patients
export const getPatients = () => {
  const patients = localStorage.getItem('patients');
  return patients ? JSON.parse(patients) : [];
};

export const setPatients = (patients) => {
  localStorage.setItem('patients', JSON.stringify(patients));
};

export const addPatient = (patient) => {
  const patients = getPatients();
  patients.push(patient);
  setPatients(patients);
};

export const updatePatient = (id, updatedPatient) => {
  const patients = getPatients();
  const index = patients.findIndex(patient => patient.id === id);
  if (index !== -1) {
    patients[index] = { ...patients[index], ...updatedPatient };
    setPatients(patients);
  }
};

export const removePatient = (id) => {
  const patients = getPatients();
  const filtered = patients.filter(patient => patient.id !== id);
  setPatients(filtered);
};

// Appointments
export const getAppointments = () => {
  const appointments = localStorage.getItem('appointments');
  return appointments ? JSON.parse(appointments) : [];
};

export const setAppointments = (appointments) => {
  localStorage.setItem('appointments', JSON.stringify(appointments));
};

export const addAppointment = (appointment) => {
  const appointments = getAppointments();
  appointments.push(appointment);
  setAppointments(appointments);
};

export const updateAppointment = (id, updatedAppointment) => {
  const appointments = getAppointments();
  const index = appointments.findIndex(appointment => appointment.id === id);
  if (index !== -1) {
    appointments[index] = { ...appointments[index], ...updatedAppointment };
    setAppointments(appointments);
  }
};

export const removeAppointment = (id) => {
  const appointments = getAppointments();
  const filtered = appointments.filter(appointment => appointment.id !== id);
  setAppointments(filtered);
};

// Medical Records
export const getMedicalRecords = () => {
  const medicalRecords = localStorage.getItem('medicalRecords');
  return medicalRecords ? JSON.parse(medicalRecords) : [];
};

export const setMedicalRecords = (medicalRecords) => {
  localStorage.setItem('medicalRecords', JSON.stringify(medicalRecords));
};

export const addMedicalRecord = (medicalRecord) => {
  const medicalRecords = getMedicalRecords();
  medicalRecords.push(medicalRecord);
  setMedicalRecords(medicalRecords);
};

// Staff
export const getStaff = () => {
  const staff = localStorage.getItem('staff');
  return staff ? JSON.parse(staff) : [];
};

export const setStaff = (staff) => {
  localStorage.setItem('staff', JSON.stringify(staff));
};

// Tasks
export const getTasks = () => {
  const tasks = localStorage.getItem('tasks');
  return tasks ? JSON.parse(tasks) : [];
};

export const setTasks = (tasks) => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

export const updateTask = (id, updatedTask) => {
  const tasks = getTasks();
  const index = tasks.findIndex(task => task.id === id);
  if (index !== -1) {
    tasks[index] = { ...tasks[index], ...updatedTask };
    setTasks(tasks);
  }
};

export const addTask = (task) => {
  const tasks = getTasks();
  tasks.push(task);
  setTasks(tasks);
};

// Reminders
export const getReminders = () => {
  const reminders = localStorage.getItem('reminders');
  return reminders ? JSON.parse(reminders) : [];
};

export const setReminders = (reminders) => {
  localStorage.setItem('reminders', JSON.stringify(reminders));
};

export const addReminder = (reminder) => {
  const reminders = getReminders();
  reminders.push(reminder);
  setReminders(reminders);
};
