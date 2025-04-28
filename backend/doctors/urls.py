from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    DoctorViewSet,
    SpecializationViewSet,
    SimpleDoctorsListView,
    SimpleSpecializationsListView,
)

router = DefaultRouter()
router.register(r'doctorsList', DoctorViewSet)
router.register(r'specializations', SpecializationViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('doctors/', SimpleDoctorsListView.as_view(), name='doctors-list'),
    path('specializations-list/', SimpleSpecializationsListView.as_view(), name='specializations-list'),
]
