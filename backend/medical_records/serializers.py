from rest_framework import serializers
from .models import MedicalRecord, LabResult, Prescription, PrescriptionMedication

class MedicalRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicalRecord
        fields = '__all__'

class LabResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabResult
        fields = '__all__'

class PrescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prescription
        fields = '__all__'

class PrescriptionMedicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrescriptionMedication
        fields = '__all__'
