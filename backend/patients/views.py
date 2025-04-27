from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, filters, status, serializers
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Patient, EmergencyContact
from .serializers import PatientSerializer, EmergencyContactSerializer
from medical_records.models import LabResult
from medical_records.serializers import LabResultSerializer


class ActivationSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()

    class Meta:
        ref_name = "PatientsActivationSerializer"

class PatientViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing patient records.
    Provides CRUD operations and additional actions for patient management.
    """
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['gender', 'blood_type', 'is_active']
    search_fields = ['first_name', 'last_name', 'email', 'phone_number']
    ordering_fields = ['first_name', 'last_name', 'created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        """
        Returns the queryset of patients with optional filtering.
        Only returns patients where is_active=True by default.
        """
        queryset = self.queryset.filter(is_active=True)

        # Filter by active status if provided explicitly
        is_active = self.request.query_params.get('is_active')
        if is_active is not None:
            queryset = self.queryset.filter(is_active=is_active.lower() == 'true')

        return queryset

    def perform_create(self, serializer):
        """
        Sets the created_by field to the current user when creating a patient.
        """
        serializer.save()

    def perform_destroy(self, instance):
        """
        Overrides the delete behavior to set is_active to False instead of deleting the record.
        Also deactivates all related data for the patient.
        """
        instance.is_active = False
        instance.save()

        # Deactivate related data
        instance.appointments.update(is_active=False)
        instance.medical_records.update(is_active=False)
        instance.emergency_contacts.update(is_active=False)

        # Add any other related data deactivation logic here

    def destroy(self, request, *args, **kwargs):
        """
        Handles the DELETE request to deactivate a patient and its related data.
        """
        instance = self.get_object()
        try:
            self.perform_destroy(instance)
            return Response({"message": "Patient and related data deactivated successfully."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    
    @action(detail=True, methods=['get'])
    def emergency_contacts(self, request, pk=None):
        """
        Retrieves all emergency contacts for a patient.
        """
        patient = self.get_object()
        contacts = patient.emergency_contacts.all()
        serializer = EmergencyContactSerializer(contacts, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'], url_path='lab-results')
    def lab_results(self, request, pk=None):
        """
        Retrieves all lab results for a patient.
        """
        patient = self.get_object()
        medical_records = patient.medical_records.filter(is_active=True).prefetch_related('lab_results')
        lab_results = LabResult.objects.filter(medical_record__in=medical_records, is_active=True)
        serializer = LabResultSerializer(lab_results, many=True)
        return Response(serializer.data)


class EmergencyContactViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing emergency contacts.
    Provides CRUD operations for emergency contact records.
    """
    queryset = EmergencyContact.objects.all()
    serializer_class = EmergencyContactSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['is_active', 'relationship']
    search_fields = ['first_name', 'last_name', 'phone_number']
