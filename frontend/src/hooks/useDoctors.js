import { useState } from "react";

const initialDoctors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialization: "Neurology",
    email: "sarah.johnson@clinic.com",
    phone: "555-123-4567",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    role: "Doctor",
  },
  {
    id: 2,
    name: "Dr. Emily Chen",
    specialization: "Cardiology",
    email: "emily.chen@clinic.com",
    phone: "555-234-5678",
    avatar: "/avatars/emily.png",
    role: "Doctor",
  },
  {
    id: 3,
    name: "Dr. Mark Williams",
    specialization: "General",
    email: "mark.williams@clinic.com",
    phone: "555-456-7890",
    avatar: "/avatars/mark.png",
    role: "Doctor",
  },
  {
    id: 4,
    name: "Dr. Jessica Lee",
    specialization: "Dermatology",
    email: "jessica.lee@clinic.com",
    phone: "555-567-8901",
    avatar: "/avatars/jessica.png",
    role: "Doctor",
  },
];

const useDoctors = () => {
  const [doctors, setDoctors] = useState(initialDoctors);
  const [query, setQuery] = useState("");

  const addDoctor = (doctor) => setDoctors(prev => [...prev, doctor]);
  const filtered = doctors.filter(d =>
    d.name.toLowerCase().includes(query.toLowerCase()) ||
    d.specialization.toLowerCase().includes(query.toLowerCase()) ||
    d.email.toLowerCase().includes(query.toLowerCase())
  );

  return { doctors: filtered, addDoctor, setQuery };
};

export default useDoctors;
