from django.db import models
from django.utils.translation import gettext_lazy as _

from patients.models import Patient
from doctors.models import Doctor
from appointments.models import Appointment
from medications.models import Medication


class MedicalRecord(models.Model):
    """
    Model representing a medical record.
    """

    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name="medical_records", verbose_name="patient")
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name="medical_records", verbose_name="doctor")
    appointment = models.OneToOneField(Appointment, on_delete=models.CASCADE, related_name="medical_records", verbose_name="appointment")
    diagnosis = models.TextField(verbose_name="diagnosis")
    description = models.TextField(verbose_name="description")
    notes = models.TextField(verbose_name="notes", null=True, blank=True)
    is_active = models.BooleanField(default=True, verbose_name="is active")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="created at")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="updated at")

class LabResults(models.Model):
    """
    Model representing lab results for an appointment.
    """

    medical_record = models.ForeignKey(MedicalRecord, on_delete=models.CASCADE, related_name="lab_results", verbose_name=_("medical record"))
    test_name = models.CharField(max_length=255, verbose_name=_("test name"))
    test_date = models.DateField(verbose_name=_("test date"))
    notes = models.TextField(verbose_name=_("notes"), null=True, blank=True)
    results = models.TextField(verbose_name=_("results"))
    is_active = models.BooleanField(default=True, verbose_name=_("is active"))
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_("created at"))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_("updated at"))



class Prescription(models.Model):
    """
    Model representing a prescription for a patient.
    """

    medical_record = models.ForeignKey(MedicalRecord, on_delete=models.CASCADE, related_name="prescriptions", verbose_name=_("medical record"))
    medication_name = models.CharField(max_length=255, verbose_name=_("medication name"))
    is_active = models.BooleanField(default=True, verbose_name=_("is active"))
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_("created at"))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_("updated at"))


class PrescriptionMedication(models.Model):
    """
    Model representing a medication in a prescription.
    """

    prescription = models.ForeignKey(Prescription, on_delete=models.CASCADE, related_name="medications", verbose_name=_("prescription"))
    medication = models.ForeignKey(Medication, on_delete=models.RESTRICT, related_name="prescriptions", verbose_name=_("medication"))
    dosage = models.CharField(max_length=255, verbose_name=_("dosage"))
    frequency = models.CharField(max_length=255, verbose_name=_("frequency"))
    duration = models.CharField(max_length=255, verbose_name=_("duration"))
    instructions = models.TextField(verbose_name=_("instructions"), null=True, blank=True)
    is_active = models.BooleanField(default=True, verbose_name=_("is active"))
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_("created at"))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_("updated at"))
