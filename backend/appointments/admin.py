from django.contrib import admin
from .models import Appointment

from unfold.admin import ModelAdmin


@admin.register(Appointment)
class CustomAdminClass(ModelAdmin):
    pass

# admin.site.register(Appointment)