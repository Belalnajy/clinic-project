from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from .models import Appointment
from .serializers import AppointmentSerializer
from .permissions import IsManagerOrSecretary, IsDoctor
from .filters import AppointmentFilter
import logging

logger = logging.getLogger(__name__)

# Create your views here.


class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_class = AppointmentFilter

    def get_queryset(self):
        # Get all active appointments
        queryset = Appointment.objects.filter(is_active=True)
        logger.info(f"Total active appointments: {queryset.count()}")

        if not self.request.user.is_authenticated:
            logger.info("User not authenticated")
            return queryset.none()

        # Log user attributes
        logger.info(f"User role: {getattr(self.request.user, 'role', 'No role')}")

        # If user is manager or secretary, show all appointments
        if self.request.user.role in ["manager", "secretary"]:
            logger.info("User is manager or secretary, showing all appointments")
            return queryset

        # If user is a doctor, show only their appointments
        if self.request.user.role == "doctor":
            if not hasattr(self.request.user, "doctor_profile"):
                logger.warning("User has doctor role but no doctor_profile")
                return queryset.none()
            doctor = self.request.user.doctor_profile
            queryset = queryset.filter(doctor=doctor)
            logger.info(
                f"Filtered appointments for doctor {doctor}: {queryset.count()}"
            )
            return queryset

        # For other authenticated users, show all appointments
        logger.info("User is authenticated, showing all appointments")
        return queryset

    def get_object(self):
        # Get the appointment ID from the URL
        appointment_id = self.kwargs.get("pk")
        logger.info(f"Looking for appointment with ID: {appointment_id}")

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

    def perform_destroy(self, instance):
        instance.is_active = False
        instance.save()

    @action(detail=True, methods=["post"])
    def cancel(self, request, pk=None):
        appointment = self.get_object()
        appointment.status = "canceled"
        appointment.save()
        return Response({"status": "appointment canceled"})

    @action(detail=True, methods=["post"])
    def complete(self, request, pk=None):
        appointment = self.get_object()
        appointment.status = "completed"
        appointment.save()
        return Response({"status": "appointment completed"})
