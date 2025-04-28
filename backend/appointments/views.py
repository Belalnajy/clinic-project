from django.shortcuts import get_object_or_404, render
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from .models import Appointment
from .serializers import AppointmentSerializer
from core.permissions import IsManagerOrSecretary, IsDoctor
from .filters import AppointmentFilter
import logging
from uuid import UUID
from django.core.exceptions import ValidationError
from patients.models import Patient
from django.db.models import Value, CharField, F, Q, Func
from django.db.models.functions import Concat
from rest_framework.response import Response

logger = logging.getLogger(__name__)


class AppointmentPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 50

    def get_paginated_response(self, data):
        return Response(
            {
                "count": self.page.paginator.count,
                "total_pages": self.page.paginator.num_pages,
                "results": data,
            }
        )


# Create your views here.


class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_class = AppointmentFilter
    pagination_class = AppointmentPagination
    ordering_fields = ["appointment_date"]
    ordering = ["-appointment_date"]

    # Annotate related fields for searching
    def get_queryset(self):
        # Use super() to allow DjangoFilterBackend to apply filters from request
        queryset = (
            super().get_queryset().filter(is_active=True).order_by("-appointment_date")
        )
        queryset = queryset.annotate(
            patient_first_name=F("patient__first_name"),
            patient_last_name=F("patient__last_name"),
            doctor_first_name=F("doctor__user__first_name"),
            doctor_last_name=F("doctor__user__last_name"),
        )
        logger.info(f"Total active appointments: {queryset.count()}")

        if not self.request.user.is_authenticated:
            logger.info("User not authenticated")
            return queryset.none()

        logger.info(f"User role: {getattr(self.request.user, 'role', 'No role')}")

        if self.request.user.role == "doctor":
            if not hasattr(self.request.user, "doctor_profile"):
                logger.warning("User has doctor role but no doctor_profile")
                return queryset.none()
            doctor = self.request.user.doctor_profile
            queryset = queryset.filter(doctor=doctor).order_by("-appointment_date")
            logger.info(
                f"Filtered appointments for doctor {doctor}: {queryset.count()}"
            )
            return queryset

        # For manager, secretary, or other roles: apply filters as requested
        return queryset

    search_fields = [
        "patient_first_name",
        "patient_last_name",
        "doctor_first_name",
        "doctor_last_name",
        "status",
    ]

    def get_object(self):
        # Get the appointment ID from the URL
        appointment_id = self.kwargs.get("pk")
        logger.info(f"Looking for appointment with ID: {appointment_id}")

        try:
            # Validate if the ID is a valid UUID
            UUID(appointment_id)
        except (ValueError, TypeError):
            logger.warning(f"Invalid UUID format: {appointment_id}")
            return None

        try:
            # First try to get the appointment without any filters
            appointment = Appointment.objects.get(appointment_id=appointment_id)
            logger.info(f"Found appointment: {appointment}")

            # Then check if the user has permission to view it
            if self.request.user.role == "doctor":
                if not hasattr(self.request.user, "doctor_profile"):
                    logger.warning("User has doctor role but no doctor_profile")
                    return None
                if appointment.doctor != self.request.user.doctor_profile:
                    logger.warning(
                        f"Doctor {self.request.user.doctor_profile} is not authorized to view appointment {appointment_id}"
                    )
                    return None

            return appointment
        except Appointment.DoesNotExist:
            logger.warning(f"Appointment with ID {appointment_id} not found")
            return None

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance is None:
            return Response(
                {
                    "error": "Appointment not found or you don't have permission to view it."
                },
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def list(self, request, *args, **kwargs):
        # Check for doctor profile before listing
        if request.user.role == "doctor" and not hasattr(
            request.user, "doctor_profile"
        ):
            return Response(
                {
                    "error": "Your doctor profile is not set up. Please contact the administrator to complete your doctor profile setup."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        return super().list(request, *args, **kwargs)

    def get_permissions(self):
        if not self.request.user.is_authenticated:
            return [IsAuthenticated()]

        if self.action in ["create", "update", "partial_update", "destroy"]:
            if self.request.user.role in ["manager", "secretary"]:
                return [IsManagerOrSecretary()]
            elif self.request.user.role == "doctor":
                if not hasattr(self.request.user, "doctor_profile"):
                    return [IsAuthenticated()]
                return [IsDoctor()]
            else:
                return [IsAuthenticated()]
        return super().get_permissions()

    def perform_create(self, serializer):
        if self.request.user.role == "doctor" and not hasattr(
            self.request.user, "doctor_profile"
        ):
            return Response(
                {
                    "error": "Your doctor profile is not set up. Please contact the administrator to complete your doctor profile setup."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        serializer.save(
            created_by=self.request.user, status="scheduled", is_active=True
        )

    def create(self, request, *args, **kwargs):
        # Extract the patient's UUID from the request data
        patient_uuid = request.data.get("patient_uuid")
        if not patient_uuid:
            return Response(
                {"error": "Patient UUID is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Fetch the patient using the UUID
        try:
            patient = get_object_or_404(Patient, patient_id=patient_uuid)
        except ValidationError:
            return Response(
                {"error": "Invalid UUID format."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Add the patient to the request data
        request.data["patient_id"] = patient.id

        # Extract billing amount from request data
        billing_amount = request.data.pop("billing_amount", None)
        if billing_amount is None:
            return Response(
                {"error": "Billing amount is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            billing_amount = float(billing_amount)
            if billing_amount <= 0:
                return Response(
                    {"error": "Billing amount must be greater than zero."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        except (ValueError, TypeError):
            return Response(
                {"error": "Invalid billing amount format."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Extract billing method from request data, default to "Cash"
        billing_method = request.data.get("billing_method", "Cash")
        if billing_method not in ["Cash", "Credit Card", "Debit Card", "Insurance"]:
            return Response(
                {
                    "error": "Invalid billing method. Must be one of: Cash, Credit Card, Debit Card, Insurance"
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Use the serializer to validate and save the appointment
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        appointment = serializer.save(created_by=request.user)

        # Create billing record
        try:
            from billing.models import Payment

            payment = Payment.objects.create(
                patient=patient,
                appointment=appointment,
                amount=billing_amount,
                method=billing_method,
                status="Pending",
            )
        except Exception as e:
            # If billing record creation fails, delete the appointment
            appointment.delete()
            return Response(
                {"error": f"Failed to create billing record: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        # Get the updated appointment with payment information
        appointment.refresh_from_db()
        serializer = self.get_serializer(appointment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        # Extract the patient's UUID from the request data
        patient_uuid = request.data.get("patient_uuid")
        if patient_uuid:
            try:
                # Fetch the patient using the UUID
                patient = get_object_or_404(Patient, patient_id=patient_uuid)
                # Add the patient ID to the request data
                request.data["patient_id"] = patient.id
            except ValidationError:
                return Response(
                    {"error": "Invalid UUID format."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            except Patient.DoesNotExist:
                return Response(
                    {"error": "Patient not found."},
                    status=status.HTTP_404_NOT_FOUND,
                )

        # Remove status from request data if present
        if "status" in request.data:
            del request.data["status"]

        # Use the serializer to validate and update the appointment
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)

    def perform_destroy(self, instance):
        instance.is_active = False
        instance.save()

    @action(detail=True, methods=["post"])
    def cancel(self, request, pk=None):
        appointment = self.get_object()
        appointment.status = "canceled"
        appointment.save()

        # Update billing record if exists
        try:
            from billing.models import Payment

            payment = Payment.objects.get(appointment=appointment)
            payment.status = "Failed"
            payment.save()
        except Payment.DoesNotExist:
            pass

        return Response({"status": "appointment canceled"})

    @action(detail=True, methods=["post"])
    def complete(self, request, pk=None):
        appointment = self.get_object()
        appointment.status = "completed"
        appointment.save()

        # Update billing record if exists
        try:
            from billing.models import Payment

            payment = Payment.objects.get(appointment=appointment)
            payment.status = "Paid"
            payment.save()
        except Payment.DoesNotExist:
            pass

        return Response({"status": "appointment completed"})

    @action(detail=True, methods=["post"])
    def queue(self, request, pk=None):
        appointment = self.get_object()
        appointment.status = "in_queue"
        appointment.save()
        return Response({"status": "appointment moved to queue"})
