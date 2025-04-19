import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addPatient } from "../../data/data"; 
import { format } from "date-fns";

const PatientModal = ({ isOpen, onClose, onSave, user }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    gender: "",
    email: "",
    phone: "",
    address: "",
    insuranceInfo: {
      provider: "",
      policyNumber: "",
      expiryDate: "",
    },
    medicalHistory: [],
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    } else {
      const today = new Date();
      const dob = new Date(formData.dateOfBirth);
      if (dob > today) newErrors.dateOfBirth = "Date of birth cannot be in the future";
    }
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{3}-\d{3}-\d{4}$/.test(formData.phone)) {
      newErrors.phone = "Phone format must be XXX-XXX-XXXX";
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.insuranceInfo.provider) {
      newErrors.provider = "Insurance provider is required";
    }
    if (!formData.insuranceInfo.policyNumber) {
      newErrors.policyNumber = "Policy number is required";
    }
    if (!formData.insuranceInfo.expiryDate) {
      newErrors.expiryDate = "Insurance expiry date is required";
    } else {
      const expiry = new Date(formData.insuranceInfo.expiryDate);
      if (expiry < new Date()) newErrors.expiryDate = "Insurance cannot be expired";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("insuranceInfo.")) {
      const field = name.split(".")[1];
      setFormData({
        ...formData,
        insuranceInfo: { ...formData.insuranceInfo, [field]: value },
      });
      setErrors({ ...errors, [field]: "" });
    } else {
      setFormData({ ...formData, [name]: value });
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSelectChange = (value) => {
    setFormData({ ...formData, gender: value });
    setErrors({ ...errors, gender: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      const patientData = {
        ...formData,
        createdBy: user?.id || "secretary-1", 
      };

      const newPatient = addPatient(patientData);

      toast.success(`Patient ${formData.fullName} added successfully`);

      if (onSave) {
        onSave(newPatient);
      }

      // Reset form and close modal
      setFormData({
        fullName: "",
        dateOfBirth: "",
        gender: "",
        email: "",
        phone: "",
        address: "",
        insuranceInfo: {
          provider: "",
          policyNumber: "",
          expiryDate: "",
        },
        medicalHistory: [],
      });
      setErrors({});
      onClose();
    } catch (error) {
      toast.error("Failed to add patient. Please try again.");
      console.error("Error adding patient:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Patient</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                name="fullName"
                placeholder="Full name"
                value={formData.fullName}
                onChange={handleChange}
                aria-invalid={!!errors.fullName}
                aria-describedby={errors.fullName ? "fullName-error" : undefined}
              />
              {errors.fullName && (
                <p id="fullName-error" className="text-red-500 text-sm">
                  {errors.fullName}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  max={format(new Date(), "yyyy-MM-dd")}
                  aria-invalid={!!errors.dateOfBirth}
                  aria-describedby={errors.dateOfBirth ? "dateOfBirth-error" : undefined}
                />
                {errors.dateOfBirth && (
                  <p id="dateOfBirth-error" className="text-red-500 text-sm">
                    {errors.dateOfBirth}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <Select
                  name="gender"
                  onValueChange={handleSelectChange}
                  value={formData.gender}
                  aria-invalid={!!errors.gender}
                  aria-describedby={errors.gender ? "gender-error" : undefined}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <p id="gender-error" className="text-red-500 text-sm">{errors.gender}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <p id="email-error" className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input
                type="tel"
                id="phone"
                name="phone"
                placeholder="XXX-XXX-XXXX"
                value={formData.phone}
                onChange={handleChange}
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? "phone-error" : undefined}
              />
              {errors.phone && (
                <p id="phone-error" className="text-red-500 text-sm">{errors.phone}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                placeholder="Street address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="provider">Insurance Provider *</Label>
              <Input
                id="provider"
                name="insuranceInfo.provider"
                placeholder="Insurance provider"
                value={formData.insuranceInfo.provider}
                onChange={handleChange}
                aria-invalid={!!errors.provider}
                aria-describedby={errors.provider ? "provider-error" : undefined}
              />
              {errors.provider && (
                <p id="provider-error" className="text-red-500 text-sm">{errors.provider}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="policyNumber">Policy Number *</Label>
              <Input
                id="policyNumber"
                name="insuranceInfo.policyNumber"
                placeholder="Policy number"
                value={formData.insuranceInfo.policyNumber}
                onChange={handleChange}
                aria-invalid={!!errors.policyNumber}
                aria-describedby={errors.policyNumber ? "policyNumber-error" : undefined}
              />
              {errors.policyNumber && (
                <p id="policyNumber-error" className="text-red-500 text-sm">
                  {errors.policyNumber}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiryDate">Insurance Expiry Date *</Label>
              <Input
                type="date"
                id="expiryDate"
                name="insuranceInfo.expiryDate"
                value={formData.insuranceInfo.expiryDate}
                onChange={handleChange}
                min={format(new Date(), "yyyy-MM-dd")}
                aria-invalid={!!errors.expiryDate}
                aria-describedby={errors.expiryDate ? "expiryDate-error" : undefined}
              />
              {errors.expiryDate && (
                <p id="expiryDate-error" className="text-red-500 text-sm">
                  {errors.expiryDate}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Patient</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PatientModal;