import { Eye, Pencil, Trash2, UserPlus, Phone, Mail, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useDeletePatientMutation, useReactivatePatientMutation } from '@/hooks/usePatients';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';

const PatientCard = ({ patient, isActive = true }) => {
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { deletePatient, isDeleting } = useDeletePatientMutation();
  const { reactivatePatient, isReactivating } = useReactivatePatientMutation();

  const handleViewPatient = (patientId) => {
    navigate(`/patient/${patientId}`);
  };

  const handleEditPatient = (patientId) => {
    navigate(`/patients/${patientId}/edit`);
  };

  const handleDeletePatient = async (patientId) => {
    try {
      await deletePatient(patientId);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting patient:', error);
    }
  };

  const handleReactivatePatient = async (patientId) => {
    try {
      await reactivatePatient(patientId);
    } catch (error) {
      console.error('Error reactivating patient:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg border p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            {patient.first_name} {patient.last_name}
          </h3>
          <p className="text-sm text-gray-500">ID: {patient.id}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleViewPatient(patient.id)}
            title="View Patient"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleEditPatient(patient.id)}
            title="Edit Patient"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          {isActive ? (
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" title="Delete Patient">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will deactivate the patient. You can reactivate them later if needed.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDeletePatient(patient.id)}
                    disabled={isDeleting}
                  >
                    {isDeleting ? 'Deactivating...' : 'Deactivate'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleReactivatePatient(patient.id)}
              disabled={isReactivating}
              title="Reactivate Patient"
            >
              <UserPlus className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-gray-500" />
          <span className="text-sm">{patient.phone_number || 'N/A'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-gray-500" />
          <span className="text-sm">{patient.email || 'N/A'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-gray-500" />
          <span className="text-sm">{patient.blood_type || 'N/A'}</span>
        </div>
      </div>
    </div>
  );
};

export default PatientCard;
