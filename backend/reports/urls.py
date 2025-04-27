from django.urls import path
from .views import (
    AppointmentMetricsView,
    PatientAnalysisView,
    DoctorPerformanceView,
    AvailableDoctorsView
)

urlpatterns = [
    path('appointment-metrics/', AppointmentMetricsView.as_view(), name='appointment-metrics'),
    path('patients-analysis/', PatientAnalysisView.as_view(), name='patient-analysis'),
    path('doctor-performance/', DoctorPerformanceView.as_view(), name='doctor-performance'),
    path('available-doctors/', AvailableDoctorsView.as_view(), name='available-doctors'),
]