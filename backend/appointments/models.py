from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core.validators import MinValueValidator

from patients.models import Patient
from doctors.models import Doctor
from medications.models import Medication

import uuid


class Appointment(models.Model):
    """
    Model representing an appointment.
    """

    APP_STATUS_CHOICES = [
        ("scheduled", "Scheduled"),
        ("completed", "Completed"),
        ("canceled", "Canceled"),
        ("in_queue", "In Queue"),
    ]

    appointment_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True, verbose_name=_("appointment ID"))
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name="appointments", verbose_name=_("patient"))
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name="appointments", verbose_name=_("doctor"))
    appointment_date = models.DateField(verbose_name=_("appointment date"))
    appointment_time = models.TimeField(verbose_name=_("appointment time"))
    duration = models.PositiveIntegerField(verbose_name=_("duration (minutes)"), validators=[MinValueValidator(1)], default=30)
    status = models.CharField(max_length=20, choices=APP_STATUS_CHOICES, default="scheduled", verbose_name=_("status"))
    notes = models.TextField(verbose_name=_("notes"), null=True, blank=True)
    is_active = models.BooleanField(default=True, verbose_name=_("is active"))
    created_by = models.ForeignKey("users.User", on_delete=models.RESTRICT, related_name="appointments", verbose_name=_("created by"))
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_("created at"))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_("updated at"))


