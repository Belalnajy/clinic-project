import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";
// import { useToast } from "@/hooks/use-toast";
import { addAppointment } from "../../data/data";
import { useAuth } from '@/contexts/Auth/useAuth';

const AppointmentModal = ({ isOpen, onClose, onSave, patients, doctors }) => {
  const { user } = useAuth();
  // const { toast } = useToast();

  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "",
    date: "",
    time: "",
    duration: "30",
    notes: "",
    status: "pending"
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = e => {
    e.preventDefault();

    // Validate form
    if (
      !formData.patientId ||
      !formData.doctorId ||
      !formData.date ||
      !formData.time ||
      !formData.duration
    ) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields"
      });
      return;
    }

    // Convert string IDs to numbers
    const appointmentData = {
      ...formData,
      patientId: parseInt(formData.patientId),
      doctorId: parseInt(formData.doctorId),
      duration: parseInt(formData.duration),
      createdBy: user.id
    };

    // Save appointment to local storage
    const newAppointment = addAppointment(appointmentData);

    // Show success message
    toast({
      title: "Success",
      description: "Appointment created successfully"
    });

    // Call onSave callback
    if (onSave) {
      onSave(newAppointment);
    }

    // Reset form
    setFormData({
      patientId: "",
      doctorId: "",
      date: "",
      time: "",
      duration: "30",
      notes: "",
      status: "pending"
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Appointment</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="patient">Patient</Label>
              <Select
                name="patientId"
                onValueChange={value => handleSelectChange("patientId", value)}
                value={formData.patientId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map(patient =>
                    <SelectItem key={patient.id} value={patient.id.toString()}>
                      {patient.firstName} {patient.lastName}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="doctor">Doctor</Label>
              <Select
                name="doctorId"
                onValueChange={value => handleSelectChange("doctorId", value)}
                value={formData.doctorId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map(doctor =>
                    <SelectItem key={doctor.id} value={doctor.id.toString()}>
                      {doctor.name}
                    </SelectItem>
                  )}
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
                onValueChange={value => handleSelectChange("duration", value)}
                value={formData.duration}>
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
              <Label htmlFor="notes">Notes</Label>
              {/* <Textarea
                id="notes"
                name="notes"
                placeholder="Add appointment notes..."
                className="min-h-[100px]"
                value={formData.notes}
                onChange={handleChange}
              /> */}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create Appointment</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentModal;
