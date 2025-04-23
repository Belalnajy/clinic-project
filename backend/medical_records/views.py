from django.shortcuts import render
from rest_framework import viewsets
from .models import MedicalRecord, LabResult, Prescription, PrescriptionMedication
from .serializers import (
    MedicalRecordSerializer,
    LabResultSerializer,
    PrescriptionSerializer,
    PrescriptionMedicationSerializer,
)
from rest_framework.pagination import PageNumberPagination

class CustomPagination(PageNumberPagination):
    """
    Custom pagination class to set default page size and allow users to specify items per page.
    """
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class MedicalRecordViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing medical record instances.
    """
    queryset = MedicalRecord.objects.all()
    serializer_class = MedicalRecordSerializer
    pagination_class = CustomPagination

class LabResultViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing lab result instances.
    """
    queryset = LabResult.objects.all()
    serializer_class = LabResultSerializer
    pagination_class = CustomPagination

class PrescriptionViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing prescription instances.
    """
    queryset = Prescription.objects.all()
    serializer_class = PrescriptionSerializer
    pagination_class = CustomPagination

class PrescriptionMedicationViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing prescription medication instances.
    """
    queryset = PrescriptionMedication.objects.all()
    serializer_class = PrescriptionMedicationSerializer
    pagination_class = CustomPagination

