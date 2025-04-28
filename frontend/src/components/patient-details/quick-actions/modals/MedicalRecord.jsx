// ** ShadCN Components **//
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
// ** React Hook Forms **//
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/Auth/useAuth';
import { useMedicalRecords } from '@/hooks/useMedicalRecords';
import { getLatestPatientAppointment } from '@/api/appointments';
import LoadingState from '@/components/LoadingState';
import CustomAlert from '@/components/CustomAlert';

const medicalRecordSchema = z.object({
  diagnosis: z.string().min(1, 'Diagnosis is required'),
  description: z.string().min(1, 'Description is required'),
  notes: z.string().optional(),
});

const MedicalRecord = ({ open, onOpenChange }) => {
  const { id: patientId } = useParams();
  const { user } = useAuth();
  const { createMedicalRecord, isCreating } = useMedicalRecords();
  const [isCheckingAppointment, setIsCheckingAppointment] = useState(true);
  const [appointmentError, setAppointmentError] = useState(null);
  const [appointment, setAppointment] = useState(null);

  const form = useForm({
    resolver: zodResolver(medicalRecordSchema),
    defaultValues: {
      diagnosis: '',
      description: '',
      notes: '',
    },
  });

  useEffect(() => {
    const checkAppointment = async () => {
      try {
        const latestAppointment = await getLatestPatientAppointment(patientId);
        if (!latestAppointment) {
          setAppointmentError('No appointment found for this patient.');
        } else if (latestAppointment.status !== 'scheduled') {
          setAppointmentError('No active appointment found for this patient.');
        } else {
          setAppointment(latestAppointment);
        }
      } catch (error) {
        console.error('Error checking appointment:', error);
        setAppointmentError('Failed to check appointment status.');
      } finally {
        setIsCheckingAppointment(false);
      }
    };

    if (open) {
      checkAppointment();
    }
  }, [open, patientId]);

  const onSubmit = async (values) => {
    try {
      await createMedicalRecord({
        ...values,
        patient_id: +patientId,
        doctor_id: user.doctor.id,
        appointment_id: appointment.id,
      });

      toast.success('Success', {
        description: 'Medical record created successfully.',
      });
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating medical record:', error);
      toast.error('Error', {
        description: error.response?.data?.message || 'Failed to create medical record.',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Medical Record</DialogTitle>
          <DialogDescription>
            Add a new medical record for the patient's current visit.
          </DialogDescription>
        </DialogHeader>

        {isCheckingAppointment ? (
          <LoadingState fullPage={true} message="Checking appointment status..." />
        ) : appointmentError ? (
          <CustomAlert variant="destructive" message={appointmentError} />
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="diagnosis"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Diagnosis</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter diagnosis" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter detailed description"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter any additional notes"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isCreating}>
                  Create Record
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MedicalRecord;
