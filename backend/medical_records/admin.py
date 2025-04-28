from django.contrib import admin
from .models import MedicalRecord, LabResult, Prescription, PrescriptionMedication

from unfold.admin import ModelAdmin


@admin.register(MedicalRecord)
class CustomAdminClass(ModelAdmin):
    pass

@admin.register(LabResult)
class CustomAdminClass(ModelAdmin):
    pass

@admin.register(Prescription)
class CustomAdminClass(ModelAdmin):
    pass

@admin.register(PrescriptionMedication)
class CustomAdminClass(ModelAdmin):
    pass
