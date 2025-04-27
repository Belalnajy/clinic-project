from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, filters, status, serializers
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Patient, EmergencyContact
from .serializers import PatientSerializer, EmergencyContactSerializer


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

        # Deactivate related appointments
        instance.appointments.update(is_active=False)

        # Deactivate related medical records
        instance.medical_records.update(is_active=False)

        # Deactivate related lab results
        for record in instance.medical_records.all():
            record.lab_results.update(is_active=False)

        # Deactivate related prescriptions
        for record in instance.medical_records.all():
            if record.prescriptions:
                record.prescriptions.is_active = False
                record.prescriptions.save()

        # Deactivate related payments
        instance.payments.update(is_active=False)

    def destroy(self, request, *args, **kwargs):
        """
        Handles the DELETE request to deactivate a patient and all related data.
        """
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({"message": "Patient and all related data deactivated successfully."}, status=status.HTTP_200_OK)

    def partial_update(self, request, *args, **kwargs):
        """
        Handles PATCH requests to update specific fields of a patient.
        """
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def emergency_contacts(self, request, pk=None):
        """
        Retrieves all emergency contacts for a patient.
        """
        patient = self.get_object()
        contacts = patient.emergency_contacts.all()
        serializer = EmergencyContactSerializer(contacts, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='deactivated')
    def deactivated_patients(self, request):
        """
        API endpoint to retrieve all deactivated patients.
        """
        queryset = self.queryset.filter(is_active=False)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], url_path='activate')
    def activate_patient(self, request, pk=None):
        """
        API endpoint to activate a deactivated patient.
        """
        patient = self.get_object()
        if not patient.is_active:
            patient.is_active = True
            patient.save()
            # Reactivate related data if needed
            patient.appointments.update(is_active=True)
            patient.medical_records.update(is_active=True)
            for record in patient.medical_records.all():
                record.lab_results.update(is_active=True)
                if record.prescriptions:
                    record.prescriptions.is_active = True
                    record.prescriptions.save()
            patient.payments.update(is_active=True)
            return Response({"message": "Patient activated successfully."}, status=status.HTTP_200_OK)
        return Response({"message": "Patient is already active."}, status=status.HTTP_400_BAD_REQUEST)


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
