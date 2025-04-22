from django.contrib import admin
from .models import MedicalRecord, LabResults, Prescription, PrescriptionMedication

admin.site.register(MedicalRecord)
admin.site.register(LabResults)
admin.site.register(Prescription)
admin.site.register(PrescriptionMedication)
