from django.shortcuts import render
from rest_framework import viewsets
from .models import MedicalRecord, LabResult, Prescription, PrescriptionMedication
from .serializers import (
    MedicalRecordSerializer,
    LabResultSerializer,
    PrescriptionSerializer,
    PrescriptionMedicationSerializer,
    BulkPrescriptionMedicationSerializer,
)
from rest_framework.pagination import PageNumberPagination
from .filters import (
    MedicalRecordFilter,
    LabResultFilter,
    PrescriptionFilter,
    PrescriptionMedicationFilter,
)
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
    page_size_query_param = "page_size"
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
    filter_fields = ["created_at", "patient", "doctor"]
    permission_classes = [IsAuthenticated, IsDoctorOrManager]

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)

        except Exception as e:
            if "medical_records_medicalrecord_appointment_id_key" in str(e):
                return Response(
                    {
                        "error": "Conflict",
                        "message": "This appointment already has a medical record.",
                    },
                    status=status.HTTP_409_CONFLICT,
                )

            raise

    @action(detail=True, methods=["get"], url_path="latest")
    def latest_medical_record(self, request, pk=None):
        try:
            latest_record = (
                self.queryset.filter(patient_id=pk, is_active=True)
                .order_by("-created_at")
                .first()
            )

            if latest_record:
                serializer = self.get_serializer(latest_record)
                return Response(serializer.data)
            return Response(
                {"detail": f"No medical records found for patient {pk}"},
                status=status.HTTP_404_NOT_FOUND,
            )
        except ValueError:
            return Response(
                {"error": "Invalid patient_id format"},
                status=status.HTTP_400_BAD_REQUEST,
            )


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

    @action(detail=True, methods=["get"], url_path="patient-results")
    def patient_results(self, request, pk=None):
        try:
            # Get all lab results for the patient directly
            lab_results = self.queryset.filter(patient_id=pk, is_active=True).order_by(
                "-created_at"
            )

            # Apply pagination
            page = self.paginate_queryset(lab_results)
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)

            serializer = self.get_serializer(lab_results, many=True)
            return Response(serializer.data)

        except ValueError:
            return Response(
                {"error": "Invalid patient_id format"},
                status=status.HTTP_400_BAD_REQUEST,
            )


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
            if "medical_records_prescription_medical_record_id_key" in str(e):
                return Response(
                    {
                        "error": "Conflict",
                        "message": "This medical record already has a prescription.",
                    },
                    status=status.HTTP_409_CONFLICT,
                )
            raise

    @action(detail=False, methods=["get"], url_path="latest")
    def latest_prescription(self, request):
        latest_prescription = self.queryset.order_by("-created_at").first()
        if latest_prescription:
            serializer = self.get_serializer(latest_prescription)
            return Response(serializer.data)
        return Response({"detail": "No prescriptions found."}, status=404)

    @action(detail=False, methods=["get"], url_path="by-patient")
    def by_patient(self, request):
        patient_id = request.query_params.get("patient_id")
        if not patient_id:
            return Response(
                {"error": "patient_id parameter is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            # Get prescriptions through medical records for the patient
            prescriptions = self.queryset.filter(
                medical_record__patient_id=patient_id, is_active=True
            ).order_by("-created_at")

            # Apply pagination
            page = self.paginate_queryset(prescriptions)
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)

            serializer = self.get_serializer(prescriptions, many=True)
            return Response(serializer.data)

        except ValueError:
            return Response(
                {"error": "Invalid patient_id format"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    @action(detail=True, methods=["post"], url_path="add-medications")
    def add_medications(self, request, pk=None):
        prescription = self.get_object()
        serializer = BulkPrescriptionMedicationSerializer(
            data=request.data, context={"prescription_id": prescription.id}
        )

        if serializer.is_valid():
            try:
                medications = serializer.save()
                response_serializer = PrescriptionMedicationSerializer(
                    medications, many=True
                )
                return Response(
                    response_serializer.data, status=status.HTTP_201_CREATED
                )
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            try:
                result = serializer.save()
                # Check if it's a bulk creation (returns a list) or single creation (returns an object)
                if isinstance(result, list):
                    response_serializer = self.get_serializer(result, many=True)
                else:
                    response_serializer = self.get_serializer(result)
                return Response(
                    response_serializer.data, status=status.HTTP_201_CREATED
                )
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["get"], url_path="latest")
    def latest_prescription_medication(self, request):
        latest_medication = self.queryset.order_by("-created_at").first()
        if latest_medication:
            serializer = self.get_serializer(latest_medication)
            return Response(serializer.data)
        return Response({"detail": "No prescription medications found."}, status=404)
