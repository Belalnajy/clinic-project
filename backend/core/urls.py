"""
URL configuration for clinic_management project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path(
        "api/",
        include(
            [
                # Custom application URLs
                path("doctors/", include("doctors.urls")),
                path("medical-records/", include("medical_records.urls")),
                path('billing/', include('billing.urls')),
                path("appointments/", include("appointments.urls")),
                path("patients/", include("patients.urls")),


            ]
        ),
    ),
]
