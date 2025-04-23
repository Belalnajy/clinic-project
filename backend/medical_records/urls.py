from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    MedicalRecordViewSet,
    LabResultViewSet,
    PrescriptionViewSet,
    PrescriptionMedicationViewSet,
)

router = DefaultRouter()
router.register(r'medical-records', MedicalRecordViewSet, basename='medical-record')
router.register(r'lab-results', LabResultViewSet, basename='lab-result')
router.register(r'prescriptions', PrescriptionViewSet, basename='prescription')
router.register(r'prescription-medications', PrescriptionMedicationViewSet, basename='prescription-medication')

urlpatterns = [
    path('', include(router.urls)),
]
