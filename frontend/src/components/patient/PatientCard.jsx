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
    navigate(`/patient/${patientId}/edit`);
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
    <div
      className={cn(
        'group relative p-6 border rounded-xl shadow-sm hover:shadow-md transition-all duration-200',
        'bg-white',
        'border-slate-200',
        'hover:border-slate-300'
      )}
    >
      {/* Status Badge */}
      <div
        className={cn(
          'absolute -top-2 -right-2 px-2 py-1 rounded-full text-xs font-medium',
          isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700'
        )}
      >
        {isActive ? 'Active' : 'Inactive'}
      </div>

      <div className="flex flex-col md:flex-row md:items-start gap-6">
        {/* Left Section - Patient Info */}
        <div className="flex-1 space-y-4">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">
              {patient.first_name} {patient.last_name}
            </h3>
            <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
              <Mail className="h-4 w-4" />
              <span>{patient.email}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-slate-500" />
              <span className="text-slate-700">{patient.phone_number}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Shield className="h-4 w-4 text-slate-500" />
              <span className="text-slate-700">{patient.insurance_provider}</span>
            </div>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex flex-col md:items-end gap-3">
          {isActive ? (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleViewPatient(patient.id)}
                className="h-9 w-9 p-0 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                title="View Patient"
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleEditPatient(patient.id)}
                className="h-9 w-9 p-0 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                title="Edit Patient"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 p-0 text-slate-600 hover:text-rose-600 hover:bg-rose-50"
                    title="Delete Patient"
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the patient and
                      remove their data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDeletePatient(patient.id)}
                      className="bg-rose-600 hover:bg-rose-700"
                    >
                      {isDeleting ? 'Deleting...' : 'Delete'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleReactivatePatient(patient.id)}
              className="text-slate-600 hover:text-emerald-600 hover:border-emerald-600 hover:bg-emerald-50"
              disabled={isReactivating}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              {isReactivating ? 'Reactivating...' : 'Reactivate Patient'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientCard;
