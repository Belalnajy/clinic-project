from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, filters, status, serializers
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import PageNumberPagination
from .models import Patient
from .statistics import get_dashboard_statistics

from appointments.models import Appointment

from rest_framework.permissions import IsAuthenticated

from .serializers import PatientSerializer


class PatientPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 100


class ActivationSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()

    class Meta:
        ref_name = "PatientsActivationSerializer"


class PatientViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing patient records.
    Provides endpoints for listing, creating, updating, and managing patient status.
    """

    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ["is_active"]
    search_fields = ["first_name", "last_name"]
    pagination_class = PatientPagination
    permission_classes = [IsAuthenticated]
    


    
    @action(detail=False, methods=['get'], url_path='statistics')
    def statistics(self, request):
        """
        Returns dashboard statistics for patients, appointments, and doctors.
        """
        stats = get_dashboard_statistics(request.user)
        return Response(stats)

    def get_queryset(self):
        """
        Returns the queryset of patients created by the current doctor,, filtering by active status.
        Default is to show only active patients.
        """
        queryset = self.queryset

        user = self.request.user
        if hasattr(user, 'role') and user.role == 'doctor' and hasattr(user, 'doctor_profile'):
            # All patients who have at least one appointment with this doctor
            patient_ids = Appointment.objects.filter(doctor=user.doctor_profile).values_list('patient', flat=True).distinct()
            queryset = queryset.filter(id__in=patient_ids)

        # Filter by active status if provided
        is_active = self.request.query_params.get('is_active')
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')

            queryset = queryset.filter(is_active=is_active.lower() == "true")
        else:
            # Default to active patients if no filter specified
            queryset = queryset.filter(is_active=True)

        return queryset

    def perform_create(self, serializer):
        """
        Sets the created_by field to the current user when creating a patient.
        """
        serializer.save(created_by=self.request.user)

    def perform_destroy(self, instance):
        """
        Override destroy to soft delete (set is_active to False)
        """
        instance.is_active = False
        instance.save()

    def update(self, request, *args, **kwargs):
        """
        Update patient data (PATCH method)
        Only allowed for active patients
        """
        instance = self.get_object()

        # Check if patient is active
        if not instance.is_active:
            return Response(
                {"error": "Cannot update inactive patient"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Partial update (PATCH)
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)

    @action(detail=True, methods=["post"])
    def reactivate(self, request, pk=None):
        """
        Reactivate a patient
        """
        # Get the patient from inactive patients
        try:
            patient = Patient.objects.get(id=pk, is_active=False)
        except Patient.DoesNotExist:
            return Response(
                {"error": "Patient not found or already active"},
                status=status.HTTP_404_NOT_FOUND,
            )

        patient.is_active = True
        patient.save()

        serializer = self.get_serializer(patient)
        return Response(
            {"message": "Patient reactivated successfully", "patient": serializer.data}
        )
