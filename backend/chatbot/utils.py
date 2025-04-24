from datetime import timedelta
from django.utils import timezone
from appointments.models import Appointment
from patients.models import Patient
from doctors.models import Doctor, Specialization
from medical_records.models import MedicalRecord, Prescription
from billing.models import Payment

import json

def get_recent_data_by_role(role):
    now = timezone.now()
    last_week = now - timedelta(days=7)

    base_data = {
        "patients": list(Patient.objects.filter(is_active=True).values("id", "name", "age")),
        "doctors": list(Doctor.objects.filter(is_active=True).values("id", "name", "specialization")),
    }

    if role == "Doctor":
        base_data.update({
            "appointments": list(Appointment.objects.filter(doctor__user__username=role, date__gte=last_week).values()),
            "patients": list(Patient.objects.filter(doctor__user__username=role).values("id", "name", "age")),
            "specializations": list(Specialization.objects.filter(doctor__user__username=role).values("id", "name")),
            "medical_records": list(MedicalRecord.objects.filter(doctor__user__username=role).order_by("-created_at")[:10].values()),
            "prescriptions": list(Prescription.objects.filter(doctor__user__username=role).order_by("-created_at")[:10].values()),
        })
    elif role == "Receptionist":
        base_data.update({
            "appointments": list(Appointment.objects.filter(date__gte=last_week).values()),
            "payments": list(Payment.objects.order_by("-date")[:10].values()),
        })
    elif role == "Manager":
        base_data.update({
            "appointments": list(Appointment.objects.filter(date__gte=last_week).values()),
            "medical_records": list(MedicalRecord.objects.order_by("-created_at")[:10].values()),
            "prescriptions": list(Prescription.objects.order_by("-created_at")[:10].values()),
            "payments": list(Payment.objects.order_by("-date")[:10].values()),
        })

    return json.dumps(base_data, indent=2)
