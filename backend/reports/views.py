from django.db import models
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from appointments.models import Appointment
from django.utils.timezone import now
from datetime import timedelta
from django.db.models import Count
from patients.models import Patient
from doctors.models import Doctor
from rest_framework.pagination import PageNumberPagination
from core.permissions import IsManagerOrSecretary
from users.models import User

class AppointmentMetricsView(APIView):
    permission_classes = [IsAuthenticated,IsManagerOrSecretary]

    def get(self, request):
        # Appointment Status Data
        statuses = Appointment.objects.values('status').annotate(count=models.Count('status'))

        # Appointment Completion Data
        total = Appointment.objects.count()
        completed = Appointment.objects.filter(status='completed').count()
        remaining = total - completed
        completion_rate = round((remaining / total) * 100) if total > 0 else 0
        

        # Daily Completion Data
        today = now().date()
        last_7_days = [today - timedelta(days=i) for i in range(7)]
        daily_completion = []
        for day in last_7_days:
            completed_count = Appointment.objects.filter(appointment_date=day, status='completed').count()
            daily_completion.append({"date": day, "completed": completed_count})

        return Response({
            "statuses": statuses,
            "completion": {
                "total": total,
                "completed": completed,
                "remaining": remaining,
                "completionRate": completion_rate
            },
            "dailyCompletion": daily_completion
        })


class PatientAnalysisView(APIView):
    permission_classes = [IsAuthenticated,IsManagerOrSecretary]

    def get(self, request):
        # Age Distribution
        today = now().date()
        age_buckets = [
            {"label": "0-10", "min": 0, "max": 10},
            {"label": "11-20", "min": 11, "max": 20},
            {"label": "21-30", "min": 21, "max": 30},
            {"label": "31-40", "min": 31, "max": 40},
            {"label": "41-50", "min": 41, "max": 50},
            {"label": "51-60", "min": 51, "max": 60},
            {"label": "61+", "min": 61, "max": None},
        ]
        age_distribution = []
        for bucket in age_buckets:
            if bucket["max"] is not None:
                count = Patient.objects.filter(
                    birth_date__lte=today.replace(year=today.year - bucket["min"]),
                    birth_date__gt=today.replace(year=today.year - bucket["max"]),
                ).count()
            else:
                count = Patient.objects.filter(
                    birth_date__lte=today.replace(year=today.year - bucket["min"])
                ).count()
            age_distribution.append({"name": bucket["label"], "count": count})

        # Gender Ratio
        gender_counts = Patient.objects.values("gender").annotate(count=Count("gender"))
        gender_ratio = [
            {"name": gender["gender"].capitalize(), "value": gender["count"]}
            for gender in gender_counts
        ]

        # Top Conditions
        condition_counts = {}
        for patient in Patient.objects.prefetch_related("medical_records"):
            for condition in patient.medical_records.all():
                condition_counts[condition.diagnosis] = condition_counts.get(condition.diagnosis, 0) + 1

        top_conditions = [
            {"name": name, "count": count}
            for name, count in sorted(condition_counts.items(), key=lambda x: x[1], reverse=True)
        ]

        # Patient Growth
        today = now().date()
        thirty_days_ago = today - timedelta(days=30)
        total_patients = Patient.objects.count()
        new_patients = Patient.objects.filter(created_at__gte=thirty_days_ago).count()
        growth_rate = (
            (new_patients / total_patients) * 100 if total_patients > 0 else 0
        )

        # Add patient growth data to the response
        patient_growth = {
            "new": new_patients,
            "growthRate": round(growth_rate, 2),
            "total": total_patients,
        }

        return Response({
            "ageDistribution": age_distribution,
            "genderRatio": gender_ratio,
            "topConditions": top_conditions,
            "patientGrowth": patient_growth,
        })


class DoctorPerformancePagination(PageNumberPagination):
    page_size = 10  # Default number of items per page
    page_size_query_param = 'page_size'  # Allow client to override page size
    max_page_size = 100  # Maximum page size allowed


class DoctorPerformanceView(APIView):
    permission_classes = [IsAuthenticated,IsManagerOrSecretary]
    def get(self, request):
        # Aggregate doctor performance data
        doctors = Doctor.objects.all().order_by('id')
        paginator = DoctorPerformancePagination()
        paginated_doctors = paginator.paginate_queryset(doctors, request)

        performance_data = []
        for doctor in paginated_doctors:
            total_appointments = doctor.appointments.count()
            completed_appointments = doctor.appointments.filter(status="completed").count()
            completion_rate = (
                (completed_appointments / total_appointments) * 100
                if total_appointments > 0
                else 0
            )

            performance_data.append({
                "id": doctor.id,
                "name": f"{doctor.user.first_name} {doctor.user.last_name}",
                "specialization": doctor.specialization.name if doctor.specialization else "N/A",
                "appointments": total_appointments,
                "completionRate": round(completion_rate, 2),
            })

        return paginator.get_paginated_response(performance_data)


class AvailableDoctorsView(APIView):
    permission_classes = [IsAuthenticated, IsManagerOrSecretary]

    def get(self, request):
        # Get count of doctors with status 'available'
        available_doctors_count = Doctor.objects.filter(
            user__status='available',
            user__role='doctor',
            user__is_active=True
        ).count()

        return Response({
            'count': available_doctors_count
        })
