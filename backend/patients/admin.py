from django.contrib import admin
from .models import Patient

from unfold.admin import ModelAdmin


@admin.register(Patient)
class CustomAdminClass(ModelAdmin):
    pass
