from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PatientViewSet, EmergencyContactViewSet

router = DefaultRouter()
router.register(r"", PatientViewSet, basename="patient")
router.register(
    r"emergency-contacts", EmergencyContactViewSet, basename="emergency-contact"
)

app_name = "patients"

urlpatterns = [
    path("", include(router.urls)),
]
