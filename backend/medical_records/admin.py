from django.contrib import admin
from .models import MedicalRecord, LabResult, Prescription, PrescriptionMedication

admin.site.register(MedicalRecord)
admin.site.register(LabResult)
admin.site.register(Prescription)
admin.site.register(PrescriptionMedication)
