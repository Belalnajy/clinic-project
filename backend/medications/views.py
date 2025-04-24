from django_filters.rest_framework import DjangoFilterBackend
from .filters import MedicationFilter
from django.shortcuts import render
from rest_framework import viewsets
from .models import Medication
from .serializers import MedicationSerializer
from rest_framework.permissions import IsAuthenticated
from core.permissions import IsDoctorOrManager

class MedicationViewSet(viewsets.ModelViewSet):
    queryset = Medication.objects.all()
    serializer_class = MedicationSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = MedicationFilter
    permission_classes = [IsAuthenticated, IsDoctorOrManager]