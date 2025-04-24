from datetime import date
from rest_framework import serializers
from .models import MedicalRecord, LabResult, Prescription, PrescriptionMedication
from patients.models import Patient  # Import Patient model
from doctors.models import Doctor  # Import Doctor model
from appointments.models import Appointment  # Import Appointment model
from medications.models import Medication  # Import Medication model
from patients.serializers import PatientSerializer
from doctors.serializers import DoctorSerializer
from appointments.serializers import AppointmentSerializer
from medications.serializers import MedicationSerializer

class MedicalRecordSerializer(serializers.ModelSerializer):
    patient_id = serializers.PrimaryKeyRelatedField(
        queryset=Patient.objects.all(), source="patient", write_only=True
    )
    doctor_id = serializers.PrimaryKeyRelatedField(
        queryset=Doctor.objects.all(), source="doctor", write_only=True
    )
    appointment_id = serializers.PrimaryKeyRelatedField(
        queryset=Appointment.objects.all(), source="appointment", write_only=True
    )
    appointment = AppointmentSerializer(read_only=True)

    class Meta:
        model = MedicalRecord
        exclude = ["patient","doctor","is_active"]
        read_only_fields = ['appointment']

    def validate(self, data):
        # Check if diagnosis is empty
        if not data.get("diagnosis"):
            raise serializers.ValidationError({"diagnosis": "Diagnosis cannot be empty."})

        # Check if description is empty
        if not data.get("description"):
            raise serializers.ValidationError({"description": "Description cannot be empty."})

        return data


class LabResultSerializer(serializers.ModelSerializer):
    medical_record_id = serializers.PrimaryKeyRelatedField(
        queryset=MedicalRecord.objects.all(), source="medical_record", write_only=True
    )
    medical_record = MedicalRecordSerializer(read_only=True)

    class Meta:
        model = LabResult
        fields = '__all__'
        read_only_fields = ['medical_record']

    def validate_test_date(self, value):
        # Check if the test_date is in the future
        if value > date.today():
            raise serializers.ValidationError("Test date cannot be in the future.")
        return value

    def validate(self, data):
        # Check if test_name is empty
        if not data.get("test_name"):
            raise serializers.ValidationError({"test_name": "Test name cannot be empty."})

        # Check if results are empty
        if not data.get("results"):
            raise serializers.ValidationError({"results": "Results cannot be empty."})

        return data


class PrescriptionSerializer(serializers.ModelSerializer):
    medical_record_id = serializers.PrimaryKeyRelatedField(
        queryset=MedicalRecord.objects.all(), source="medical_record", write_only=True
    )
    medical_record = MedicalRecordSerializer(read_only=True)

    class Meta:
        model = Prescription
        fields = '__all__'
        read_only_fields = ['medical_record']

    def validate(self, data):
        # Add any specific validation for prescriptions if needed
        return data


class PrescriptionMedicationSerializer(serializers.ModelSerializer):
    prescription_id = serializers.PrimaryKeyRelatedField(
        queryset=Prescription.objects.all(), source="prescription", write_only=True
    )
    medication_id = serializers.PrimaryKeyRelatedField(
        queryset=Medication.objects.all(), source="medication", write_only=True
    )
    prescription = PrescriptionSerializer(read_only=True)
    medication = MedicationSerializer(read_only=True)

    class Meta:
        model = PrescriptionMedication
        fields = '__all__'
        read_only_fields = ['prescription', 'medication']

    def validate(self, data):
        # Check if dosage is empty
        if not data.get("dosage"):
            raise serializers.ValidationError({"dosage": "Dosage cannot be empty."})

        # Check if frequency is empty
        if not data.get("frequency"):
            raise serializers.ValidationError({"frequency": "Frequency cannot be empty."})

        # Check if duration is empty
        if not data.get("duration"):
            raise serializers.ValidationError({"duration": "Duration cannot be empty."})

        return data
