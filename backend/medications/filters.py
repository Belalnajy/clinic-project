from django_filters import rest_framework as filters
from .models import Medication

class MedicationFilter(filters.FilterSet):
    name = filters.CharFilter(lookup_expr="icontains")
    is_active = filters.BooleanFilter()
    created_at__gte = filters.Date(field_name="created_at", lookup_expr="gte")
    created_at__lte = filters.DateTimeFilter(field_name="created_at", lookup_expr="lte")

    class Meta:
        model = Medication
        fields = ["name", "is_active", "created_at"]
