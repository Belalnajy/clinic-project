"""
URL configuration for clinic_management project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="Healthcare Management System API",
        default_version="v1",
        description="API documentation for Healthcare Management System",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="contact@healthcare.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path("admin/", admin.site.urls),
    path('api/auth/', include('djoser.urls')),
    path('api/auth/', include('djoser.urls.jwt')),
    path(
        "api/",
        include(
            [
                # Custom application URLs
                path("doctors/", include("doctors.urls")),
                path("", include("medical_records.urls")),
                path('billing/', include('billing.urls')),
                path("appointments/", include("appointments.urls")),
                path("patients/", include("patients.urls")),
                path('medications/', include('medications.urls')),

                path(
                    "docs/",
                    schema_view.with_ui("swagger", cache_timeout=0),
                    name="schema-swagger-ui",
                ),
                path(
                    "redoc/",
                    schema_view.with_ui("redoc", cache_timeout=0),
                    name="schema-redoc",
                ),
            ]
        ),
    ),
]
