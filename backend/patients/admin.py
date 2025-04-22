from django.contrib import admin
from .models import Patient, EmergencyContact

admin.site.register(Patient)
admin.site.register(EmergencyContact)