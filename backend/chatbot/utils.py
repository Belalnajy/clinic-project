from datetime import timedelta
from django.utils import timezone
from appointments.models import Appointment
from patients.models import Patient
from doctors.models import Doctor, Specialization
from medical_records.models import MedicalRecord, Prescription
from billing.models import Payment
from medications.models import Medication

import json
import datetime

def custom_serializer(obj):
    if isinstance(obj, (datetime.date, datetime.datetime)):
        return obj.isoformat()
    raise TypeError(f"Type {type(obj)} not serializable")

def get_recent_data_by_role(role, user):
    now = timezone.now()
    last_week = now - timedelta(days=7)

    if role == "Manager":
        data = {
            "patients": list(Patient.objects.all().values()),
            "doctors": list(Doctor.objects.all().values("id", "user__first_name", "user__last_name", "specialization__name", "years_of_experience", "bio")),
            "appointments": list(Appointment.objects.all().values()),
            "medical_records": list(MedicalRecord.objects.all().values()),
            "prescriptions": list(Prescription.objects.all().values()),
            "payments": list(Payment.objects.all().values()),
            "medications": list(Medication.objects.all().values()),
        }

    elif role == "Doctor":
        data = {
            "profile": Doctor.objects.filter(user=user).values("id", "user__first_name", "user__last_name", "specialization__name", "years_of_experience", "bio").first(),
            "patients": list(Patient.objects.filter(appointments__doctor__user=user).distinct().values("id", "first_name", "last_name", "birth_date", "gender")),
            "appointments": list(Appointment.objects.filter(doctor__user=user).values()),
            "medications": list(Medication.objects.filter(prescriptions__medical_record__doctor__user=user).distinct().values("id", "name", "default_dosage", "description")),
        }

    elif role == "Secretary":
        data = {
            "appointments": list(Appointment.objects.all().values()),
            "payments": list(Payment.objects.all().values()),
            "patients": list(Patient.objects.all().values("id", "first_name", "last_name", "birth_date", "gender")),
        }

    else:
        data = {"error": "Invalid role"}

    return json.dumps(data, indent=2, default=custom_serializer)
