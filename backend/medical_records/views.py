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
from .filters import MedicalRecordFilter, LabResultFilter, PrescriptionFilter, PrescriptionMedicationFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from core.permissions import IsDoctorOrManager
from rest_framework import status
from rest_framework.exceptions import ValidationError

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
    filter_backends = [DjangoFilterBackend]
    filterset_class = MedicalRecordFilter
    filter_fields = ['created_at', 'patient', 'doctor']
    permission_classes = [IsAuthenticated, IsDoctorOrManager]

    def get_queryset(self):
        queryset = self.queryset
        user = self.request.user
        if hasattr(user, 'role') and user.role == 'doctor' and hasattr(user, 'doctor_profile'):
            queryset = queryset.filter(doctor=user.doctor_profile)
        return queryset

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)

        except Exception as e:
            if 'medical_records_medicalrecord_appointment_id_key' in str(e):
                return Response({
                        "error": "Conflict",
                        "message": "This appointment already has a medical record."
                    }, status=status.HTTP_409_CONFLICT)
            
            raise

    @action(detail=False, methods=["get"], url_path="latest")
    def latest_medical_record(self, request):
        latest_record = self.queryset.order_by("-created_at").first()
        if latest_record:
            serializer = self.get_serializer(latest_record)
            return Response(serializer.data)
        return Response({"detail": "No medical records found."}, status=404)

class LabResultViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing lab result instances.
    """
    queryset = LabResult.objects.all()
    serializer_class = LabResultSerializer
    pagination_class = CustomPagination
    filter_backends = [DjangoFilterBackend]
    filterset_class = LabResultFilter
    permission_classes = [IsAuthenticated, IsDoctorOrManager]

    @action(detail=False, methods=["get"], url_path="latest")
    def latest_lab_result(self, request):
        latest_result = self.queryset.order_by("-created_at").first()
        if latest_result:
            serializer = self.get_serializer(latest_result)
            return Response(serializer.data)
        return Response({"detail": "No lab results found."}, status=404)

class PrescriptionViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing prescription instances.
    """
    queryset = Prescription.objects.all()
    serializer_class = PrescriptionSerializer
    pagination_class = CustomPagination
    filter_backends = [DjangoFilterBackend]
    filterset_class = PrescriptionFilter
    permission_classes = [IsAuthenticated, IsDoctorOrManager]

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)

        except Exception as e:
            if 'medical_records_prescription_medical_record_id_key' in str(e):
                return Response({
                        "error": "Conflict",
                        "message": "This medical record already has a prescription."
                    }, status=status.HTTP_409_CONFLICT)
            raise 

    @action(detail=False, methods=["get"], url_path="latest")
    def latest_prescription(self, request):
        latest_prescription = self.queryset.order_by("-created_at").first()
        if latest_prescription:
            serializer = self.get_serializer(latest_prescription)
            return Response(serializer.data)
        return Response({"detail": "No prescriptions found."}, status=404)

class PrescriptionMedicationViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing prescription medication instances.
    """
    queryset = PrescriptionMedication.objects.all()
    serializer_class = PrescriptionMedicationSerializer
    pagination_class = CustomPagination
    filter_backends = [DjangoFilterBackend]
    filterset_class = PrescriptionMedicationFilter
    permission_classes = [IsAuthenticated, IsDoctorOrManager]

    @action(detail=False, methods=["get"], url_path="latest")
    def latest_prescription_medication(self, request):
        latest_medication = self.queryset.order_by("-created_at").first()
        if latest_medication:
            serializer = self.get_serializer(latest_medication)
            return Response(serializer.data)
        return Response({"detail": "No prescription medications found."}, status=404)

