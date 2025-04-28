from datetime import date
from django.db.models import Count
from patients.models import Patient
from doctors.models import Doctor
from appointments.models import Appointment

def get_dashboard_statistics(user=None):
    today = date.today()
    stats = {}
    # IF USER IS DOCTOR
    if user and hasattr(user, 'role') and user.role == 'doctor' and hasattr(user, 'doctor_profile'):
        doctor = user.doctor_profile
        stats['patients_today'] = Appointment.objects.filter(doctor=doctor, appointment_date=today).values('patient').distinct().count()
        stats['active_patients'] = Patient.objects.filter(doctor=doctor, is_active=True).count()
        stats['appointments_today'] = Appointment.objects.filter(doctor=doctor, appointment_date=today).count()

        stats['new_registrations'] = Patient.objects.filter(doctor=doctor, created_at__date=today).count()
    else:
        # IF USER IS ADMIN OR SECRETARY
        stats['patients_today'] = Patient.objects.filter(created_at__date=today).count()
        stats['active_patients'] = Patient.objects.filter(is_active=True).count()
        stats['appointments_today'] = Appointment.objects.filter(appointment_date=today).count()
        stats['available_doctors'] = Doctor.objects.filter(user__status='available',).count() if hasattr(Doctor, 'user') else Doctor.objects.count()
        stats['new_registrations'] = Patient.objects.filter(created_at__date=today).count()
        stats['waiting_patients'] = Appointment.objects.filter(status='in_queue',appointment_date=today).count()
    return stats

