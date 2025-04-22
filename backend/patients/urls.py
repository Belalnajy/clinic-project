from django.urls import path,include
from .views import PatientViewSet, EmergencyContactViewSet
from rest_framework.routers import DefaultRouter

app_name = 'patients'

router = DefaultRouter()
# Register the viewset with the router
router.register('patients', PatientViewSet)
router.register('emergency-contacts', EmergencyContactViewSet)


urlpatterns = [
    path('api/', include(router.urls)),
]