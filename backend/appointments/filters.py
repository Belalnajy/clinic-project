from django_filters import rest_framework as filters
from .models import Appointment


class AppointmentFilter(filters.FilterSet):
    appointment_date = filters.DateFilter()
    appointment_date__gte = filters.DateFilter(
        field_name="appointment_date", lookup_expr="gte"
    )
    appointment_date__lte = filters.DateFilter(
        field_name="appointment_date", lookup_expr="lte"
    )
    status = filters.CharFilter()
    doctor = filters.NumberFilter()
    patient = filters.NumberFilter()
    specialization = filters.NumberFilter(field_name='doctor__specialization')
    ordering = filters.OrderingFilter(
        fields=(
            ("appointment_date", "appointment_date"),
            ("created_at", "created_at"),
        )
    )

    class Meta:
        model = Appointment
        fields = ["appointment_date", "status", "doctor", "patient", "specialization"]
