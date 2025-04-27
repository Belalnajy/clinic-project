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
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

const AppointmentModal = ({ isOpen, onClose, onSave, patients, doctors, initialData }) => {
  const { user } = useAuth();

  // Initialize formData with initialData if provided
  const [formData, setFormData] = useState({
    patient_uuid: '',
    doctorId: '',
    date: '',
    time: '',
    duration: '30',
    notes: '',
    status: 'scheduled',
  });

  // Update formData when initialData changes (e.g., when switching between edit and create modes)
  useEffect(() => {
    if (initialData) {
      const updatedFormData = {
        patient_uuid: initialData.patient.patient_id || '', // Correctly map patient_uuid
        doctorId: initialData.doctor.id || '', // Correctly map doctor_id
        date: initialData.appointment_date || '', // Correctly map appointment_date
        time: initialData.appointment_time || '', // Correctly map appointment_time
        duration: initialData.duration?.toString() || '30', // Correctly map duration
        notes: initialData.notes || '', // Correctly map notes
        status: initialData.status || 'scheduled', // Correctly map status
      };
      console.log('Updated Form Data:', updatedFormData);
      setFormData(updatedFormData);
    }
  }, [initialData]);

  useEffect(() => {
    console.log('Form Data Updated:', formData);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (
      !formData.patient_uuid ||
      !formData.doctorId ||
      !formData.date ||
      !formData.time ||
      !formData.duration
    ) {
      toast.error('Cannot submit an empty form', {
        description: 'Please fill in all required fields.',
      });
      return;
    }

    const appointmentData = {
      patient_uuid: formData.patient_uuid,
      doctor_id: formData.doctorId,
      appointment_date: formData.date,
      appointment_time: formData.time,
      duration: parseInt(formData.duration),
      notes: formData.notes,
      status: formData.status,
    };

    try {
      await onSave(appointmentData); // Call the onSave function (create or update)
      setFormData({
        patient_uuid: '',
        doctorId: '',
        date: '',
        time: '',
        duration: '30',
        notes: '',
        status: 'scheduled',
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.appointment_time?.[0] ||
        error.response?.data?.error ||
        error.response?.data?.message ||
        'An error occurred while saving the appointment.';

      toast.error('Failed to save appointment', {
        description: errorMessage,
      });
    }
  };

  const handleClose = () => {
    setFormData({
      patient_uuid: '',
      doctorId: '',
      date: '',
      time: '',
      duration: '30',
      notes: '',
      status: 'scheduled',
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Appointment' : 'New Appointment'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="patient_uuid">Patient UUID</Label>
              <Input
                id="patient_uuid"
                name="patient_uuid"
                placeholder="Enter patient's uuid"
                value={formData.patient_uuid}
                onChange={handleChange}
                disabled={!!initialData} // Disable if editing
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="doctor">Doctor</Label>
              <Select
                name="doctorId"
                onValueChange={(value) => handleSelectChange('doctorId', value)}
                value={formData.doctorId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id.toString()}>
                      {doctor.first_name} {doctor.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  type="time"
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Select
                name="duration"
                onValueChange={(value) => handleSelectChange('duration', value)}
                value={formData.duration}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="doctor">Status</Label>
              <Select
                name="status"
                onValueChange={(value) => handleSelectChange('status', value)}
                value={formData.status}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key="scheduled" value="scheduled">
                    Scheduled
                  </SelectItem>
                  <SelectItem key="completed" value="completed">
                    Completed
                  </SelectItem>
                  <SelectItem key="canceled" value="canceled">
                    Canceled
                  </SelectItem>
                  <SelectItem key="in_queue" value="in_queue">
                    In queue
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Add appointment notes..."
                className="min-h-[100px]"
                value={formData.notes}
                onChange={handleChange}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" type="button" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">
              {initialData ? 'Update Appointment' : 'Create Appointment'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentModal;
