import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAllPatients } from '../data/data';
import PatientModal from './modals/PatientModal';

const PatientList = ({ onNewPatient }) => {
  const [patients, setPatients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  useEffect(() => {
    // Load patients from local storage
    setPatients(getAllPatients());
  }, []);
  
  const openModal = () => {
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
  };
  
  const handleNewPatient = (patientData) => {
    if (onNewPatient) {
      onNewPatient(patientData);
    }
    
    // Refresh patients list
    setPatients(getAllPatients());
    closeModal();
  };
  
  const displayedPatients = patients.slice(0, 4); // Show only first 4 patients

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Patients</CardTitle>
            <Button variant="outline" size="sm" onClick={openModal}>
              <i className="fas fa-plus mr-1"></i> Add Patient
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {displayedPatients.map(patient => (
              <div key={patient.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback>{patient.fullName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{patient.firstName} {patient.lastName}</p>
                    <p className="text-xs text-slate-500">
                      {new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()} years • {patient.gender}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" aria-label="View">
                  <i className="fas fa-eye text-sm"></i>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="justify-center">
          <Button variant="ghost" className="text-primary-600 text-sm">View All Patients</Button>
        </CardFooter>
      </Card>
      
      <PatientModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        onSave={handleNewPatient}
      />
    </>
  );
};

export default PatientList;
