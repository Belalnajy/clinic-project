from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DoctorViewSet, SpecializationViewSet

router = DefaultRouter()
router.register(r'doctors', DoctorViewSet)
router.register(r'specializations', SpecializationViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
