from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, filters, status, serializers
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Patient
from .serializers import PatientSerializer


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
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["is_active"]

    def get_queryset(self):
        """
        Returns the queryset of patients, filtering by active status.
        Default is to show only active patients.
        """
        queryset = self.queryset

        # Get is_active filter from query params
        is_active = self.request.query_params.get("is_active")
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == "true")
        else:
            # Default to active patients if no filter specified
            queryset = queryset.filter(is_active=True)

        return queryset

    def perform_create(self, serializer):
        """
        Sets the created_by field to the current user when creating a patient.
        """
        serializer.save()

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
