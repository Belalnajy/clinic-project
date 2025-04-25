from django_filters import rest_framework as filters
from .models import MedicalRecord, LabResult, Prescription, PrescriptionMedication


class MedicalRecordFilter(filters.FilterSet):
    created_at = filters.DateTimeFilter()
    created_at__gte = filters.DateTimeFilter(field_name="created_at", lookup_expr="gte")
    created_at__lte = filters.DateTimeFilter(field_name="created_at", lookup_expr="lte")
    patient = filters.NumberFilter()
    doctor = filters.NumberFilter()

    class Meta:
        model = MedicalRecord
        fields = ["created_at", "patient", "doctor"]


class LabResultFilter(filters.FilterSet):
    test_date = filters.DateFilter()
    test_date__gte = filters.DateFilter(field_name="test_date", lookup_expr="gte")
    test_date__lte = filters.DateFilter(field_name="test_date", lookup_expr="lte")
    medical_record = filters.NumberFilter()
    test_name = filters.CharFilter(lookup_expr="icontains")

    class Meta:
        model = LabResult
        fields = ["test_date", "medical_record", "test_name"]


class PrescriptionFilter(filters.FilterSet):
    created_at = filters.DateTimeFilter()
    created_at__gte = filters.DateTimeFilter(field_name="created_at", lookup_expr="gte")
    created_at__lte = filters.DateTimeFilter(field_name="created_at", lookup_expr="lte")
    medical_record = filters.NumberFilter()

    class Meta:
        model = Prescription
        fields = ["created_at", "medical_record"]


class PrescriptionMedicationFilter(filters.FilterSet):
    prescription = filters.NumberFilter()
    medication = filters.NumberFilter()
    dosage = filters.CharFilter(lookup_expr="icontains")
    frequency = filters.CharFilter(lookup_expr="icontains")

    class Meta:
        model = PrescriptionMedication
        fields = ["prescription", "medication", "dosage", "frequency"]
