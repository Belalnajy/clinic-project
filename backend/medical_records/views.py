from django.shortcuts import render
from rest_framework import viewsets
from .models import MedicalRecord, LabResult, Prescription, PrescriptionMedication
from .serializers import (
    MedicalRecordSerializer,
    LabResultSerializer,
    PrescriptionSerializer,
    PrescriptionMedicationSerializer,
)

class MedicalRecordViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing medical record instances.
    """
    queryset = MedicalRecord.objects.all()
    serializer_class = MedicalRecordSerializer

class LabResultViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing lab result instances.
    """
    queryset = LabResult.objects.all()
    serializer_class = LabResultSerializer

class PrescriptionViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing prescription instances.
    """
    queryset = Prescription.objects.all()
    serializer_class = PrescriptionSerializer

class PrescriptionMedicationViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing prescription medication instances.
    """
    queryset = PrescriptionMedication.objects.all()
    serializer_class = PrescriptionMedicationSerializer

