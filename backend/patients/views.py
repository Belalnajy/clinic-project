from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, filters, status, serializers
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Patient, EmergencyContact
from .serializers import PatientSerializer, EmergencyContactSerializer
from .statistics import get_dashboard_statistics
from medical_records.models import LabResult
from medical_records.serializers import LabResultSerializer
from appointments.models import Appointment
from rest_framework.permissions import IsAuthenticated


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
        Returns the queryset of patients created by the current doctor, with optional filtering.
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

        return queryset

    def perform_create(self, serializer):
        """
        Sets the created_by field to the current user when creating a patient.
        """
        serializer.save()

    @action(detail=True, methods=['post'], serializer_class=ActivationSerializer)
    def deactivate(self, request, pk=None):
        """
        Deactivates a patient record.
        """
        try:
            patient = self.get_object()
            if not patient.is_active:
                return Response(
                    {'message': 'Patient is already deactivated'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            patient.is_active = False
            patient.save()
            
            serializer = self.get_serializer(patient)
            return Response({
                'message': 'Patient deactivated successfully',
                'patient': serializer.data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=True, methods=['post'], serializer_class=ActivationSerializer)
    def activate(self, request, pk=None):
        """
        Activates a patient record.
        """
        try:
            patient = self.get_object()
            if patient.is_active:
                return Response(
                    {'message': 'Patient is already active'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            patient.is_active = True
            patient.save()
            
            serializer = self.get_serializer(patient)
            return Response({
                'message': 'Patient activated successfully',
                'patient': serializer.data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

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
    