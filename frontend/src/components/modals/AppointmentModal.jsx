import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
// import { useToast } from "@/hooks/use-toast";
import { toast } from 'sonner';
import { addAppointment } from '../../data/data';
import { useAuth } from '@/contexts/Auth/useAuth';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDoctors } from '@/hooks/useDoctors';
import useAppointments from '@/hooks/useAppointments';

const formSchema = z.object({
  patient_uuid: z.string().min(1, { message: 'Patient UUID is required' }),
  doctor_id: z.union([z.string(), z.number()]).refine((val) => val !== '', { message: 'Doctor is required' }),
  appointment_date: z.string().min(1, { message: 'Date is required' }),
  appointment_time: z.string().min(1, { message: 'Time is required' }),
  duration: z.union([z.string(), z.number()]).refine((val) => val !== '', { message: 'Duration is required' }),
  notes: z.string().optional(),
  status: z.enum(['scheduled', 'completed', 'canceled', 'in_queue']),
});

const AppointmentModal = ({ isOpen, onClose, appointmentId, isEditing }) => {
  const { user } = useAuth();
  const { allDoctors : doctors } = useDoctors();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {createAppointment, updateAppointment, useAppointment} = useAppointments();
  const { data: appointmentData } = useAppointment(appointmentId);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patient_uuid: '',
      doctor_id: '',
      appointment_date: '',
      appointment_time: '',
      duration: '30',
      notes: '',
      status: 'scheduled',
    },
  });
  const {reset} = form;

  useEffect(() => {
    if(isOpen) {
      if (isEditing && appointmentData) {
        reset({
          patient_uuid: appointmentData.patient.patient_id,
          doctor_id: appointmentData.doctor.id,
          appointment_date: appointmentData.appointment_date,
          appointment_time: appointmentData.appointment_time,
          duration: appointmentData.duration,
          notes: appointmentData.notes,
          status: appointmentData.status,
        });
      }
      else {
        reset({
          patient_uuid: '',
          doctor_id: '',
          appointment_date: '',
          appointment_time: '',
          duration: '30',
          notes: '',
          status: 'scheduled',
        });
      }
    }
  }, [isOpen, appointmentData, reset, isEditing]);

  const onSubmit = async (appointmentData) => {
    console.log('Form submitted:', appointmentData);
    try {
      setIsSubmitting(true);
      if (isEditing) {
        console.log('Editing appointment:', appointmentId);
        console.log('Appointment data:', appointmentData);
        // Update appointment logic here
        await updateAppointment({ id: appointmentId, data: appointmentData });
        toast.success('Appointment updated successfully');
      } else {
        await createAppointment(appointmentData);
        toast.success('Appointment saved successfully');
      }
    } catch (error) {
      console.error('Error saving appointment:', error);
      toast.error('Failed to save appointment');
    } finally {
      setIsSubmitting(false)
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Appointment' : 'New Appointment'}</DialogTitle>
        </DialogHeader>
        {/* Form */}
        <Form {...form}>
          <form className="p-6 md:p-8" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              {/* Patient UUID Field */}
              <FormField
                control={form.control}
                name="patient_uuid"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patient UUID</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Patient UUID" {...field} disabled={ isEditing }/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Doctor Select Field */}
              <FormField
                control={form.control}
                name="doctor_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Doctor</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a doctor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {doctors.map((doctor) => (
                          <SelectItem key={doctor.id} value={doctor.id}>
                            {doctor.first_name} {doctor.last_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Date Field */}
              <FormField
                control={form.control}
                name="appointment_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>
              {/* Time Field */}
              <FormField
                control={form.control}
                name="appointment_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /></div>
              {/* Duration Field */}
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (minutes)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Notes Field */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter notes" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Status Select Field */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="canceled">Canceled</SelectItem>
                        <SelectItem value="in_queue">In Queue</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}  />

              <Button type="submit" className="w-full bg-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting' : 'Submit'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentModal;
