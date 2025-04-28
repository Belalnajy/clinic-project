from django.contrib import admin
from .models import Medication

from unfold.admin import ModelAdmin


@admin.register(Medication)
class CustomAdminClass(ModelAdmin):
    pass