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
        exclude = ["patient", "doctor", "is_active"]
        read_only_fields = ["appointment"]

    def validate(self, data):
        # Check if diagnosis is empty
        if not data.get("diagnosis"):
            raise serializers.ValidationError(
                {"diagnosis": "Diagnosis cannot be empty."}
            )

        # Check if description is empty
        if not data.get("description"):
            raise serializers.ValidationError(
                {"description": "Description cannot be empty."}
            )

        return data


class LabResultSerializer(serializers.ModelSerializer):
    medical_record_id = serializers.PrimaryKeyRelatedField(
        queryset=MedicalRecord.objects.all(), source="medical_record", write_only=True
    )
    medical_record = MedicalRecordSerializer(read_only=True)

    class Meta:
        model = LabResult
        fields = "__all__"
        read_only_fields = ["medical_record"]

    def validate_test_date(self, value):
        # Check if the test_date is in the future
        if value > date.today():
            raise serializers.ValidationError("Test date cannot be in the future.")
        return value

    def validate(self, data):
        # Check if test_name is empty
        if not data.get("test_name"):
            raise serializers.ValidationError(
                {"test_name": "Test name cannot be empty."}
            )

        # Check if results are empty
        if not data.get("results"):
            raise serializers.ValidationError({"results": "Results cannot be empty."})

        return data


class PrescriptionMedicationSerializer(serializers.ModelSerializer):
    prescription_id = serializers.PrimaryKeyRelatedField(
        queryset=Prescription.objects.all(), source="prescription", write_only=True
    )
    medication_id = serializers.PrimaryKeyRelatedField(
        queryset=Medication.objects.all(),
        source="medication",
        write_only=True,
        required=False,
    )
    medication = MedicationSerializer(read_only=True)
    medications = serializers.ListField(
        child=serializers.DictField(), required=False, write_only=True
    )
    dosage = serializers.CharField(required=False)
    frequency = serializers.CharField(required=False)
    duration = serializers.CharField(required=False)

    class Meta:
        model = PrescriptionMedication
        fields = [
            "id",
            "prescription_id",
            "medication_id",
            "medication",
            "medications",
            "dosage",
            "frequency",
            "duration",
            "instructions",
            "created_at",
            "updated_at",
            "is_active",
        ]
        read_only_fields = ["medication"]

    def validate(self, data):
        prescription = data.get("prescription")

        # Check if we're doing bulk creation
        if "medications" in data:
            if not data["medications"]:
                raise serializers.ValidationError(
                    {"medications": "Medications list cannot be empty"}
                )

            # Validate each medication in the list
            required_fields = ["medication_id", "dosage", "frequency", "duration"]
            medication_ids = (
                set()
            )  # Track medication IDs to check for duplicates in the request

            for medication in data["medications"]:
                # Check for missing required fields
                missing_fields = [
                    field for field in required_fields if field not in medication
                ]
                if missing_fields:
                    raise serializers.ValidationError(
                        {
                            "medications": f"Each medication must have: {', '.join(missing_fields)}"
                        }
                    )

                # Check for duplicate medication IDs in the request
                med_id = medication["medication_id"]
                if med_id in medication_ids:
                    raise serializers.ValidationError(
                        {
                            "medications": f"Duplicate medication_id {med_id} in the request"
                        }
                    )
                medication_ids.add(med_id)

                # Validate medication_id exists and get medication name
                try:
                    med = Medication.objects.get(id=med_id)
                    # Check if medication already exists in the prescription
                    if PrescriptionMedication.objects.filter(
                        prescription=prescription, medication_id=med_id, is_active=True
                    ).exists():
                        raise serializers.ValidationError(
                            {
                                "medications": f"Medication '{med.name}' (ID: {med_id}) already exists in this prescription"
                            }
                        )
                except Medication.DoesNotExist:
                    raise serializers.ValidationError(
                        {"medications": f"Invalid medication_id: {med_id}"}
                    )
        else:
            # Single medication validation
            required_fields = ["medication_id", "dosage", "frequency", "duration"]
            missing_fields = [field for field in required_fields if field not in data]
            if missing_fields:
                errors = {
                    field: ["This field is required."] for field in missing_fields
                }
                raise serializers.ValidationError(errors)

            # Check if medication already exists in the prescription
            try:
                med = Medication.objects.get(id=data["medication_id"])
                if PrescriptionMedication.objects.filter(
                    prescription=prescription,
                    medication_id=data["medication_id"],
                    is_active=True,
                ).exists():
                    raise serializers.ValidationError(
                        {
                            "medication_id": f"Medication '{med.name}' (ID: {data['medication_id']}) already exists in this prescription"
                        }
                    )
            except Medication.DoesNotExist:
                raise serializers.ValidationError(
                    {"medication_id": f"Invalid medication_id: {data['medication_id']}"}
                )

        return data

    def create(self, validated_data):
        if "medications" in validated_data:
            # Handle bulk creation
            prescription = validated_data["prescription"]
            medications = []

            for medication_data in validated_data["medications"]:
                medication = PrescriptionMedication.objects.create(
                    prescription=prescription,
                    medication_id=medication_data["medication_id"],
                    dosage=medication_data["dosage"],
                    frequency=medication_data["frequency"],
                    duration=medication_data["duration"],
                    instructions=medication_data.get("instructions", ""),
                )
                medications.append(medication)

            return medications
        else:
            # Handle single creation
            return super().create(validated_data)


class PrescriptionSerializer(serializers.ModelSerializer):
    medical_record_id = serializers.PrimaryKeyRelatedField(
        queryset=MedicalRecord.objects.all(), source="medical_record", write_only=True
    )
    medical_record = MedicalRecordSerializer(read_only=True)
    medications = serializers.SerializerMethodField()

    class Meta:
        model = Prescription
        fields = [
            "id",
            "medical_record_id",
            "medical_record",
            "medications",
            "created_at",
            "updated_at",
            "is_active",
        ]
        read_only_fields = ["medical_record"]

    def get_medications(self, obj):
        # Get all active medications for this prescription
        medications = obj.medications.filter(is_active=True)
        serializer = PrescriptionMedicationSerializer(medications, many=True)
        return serializer.data

    def validate(self, data):
        # Add any specific validation for prescriptions if needed
        return data


class BulkPrescriptionMedicationSerializer(serializers.Serializer):
    medications = serializers.ListField(
        child=serializers.DictField(child=serializers.CharField(), allow_empty=False),
        required=True,
    )

    def validate_medications(self, medications):
        required_fields = ["medication_id", "dosage", "frequency", "duration"]
        for medication in medications:
            for field in required_fields:
                if field not in medication:
                    raise serializers.ValidationError(
                        f"Each medication must have a {field}"
                    )
        return medications

    def create(self, validated_data):
        prescription_id = self.context.get("prescription_id")
        medications = []

        for medication_data in validated_data["medications"]:
            medication = PrescriptionMedication.objects.create(
                prescription_id=prescription_id,
                medication_id=medication_data["medication_id"],
                dosage=medication_data["dosage"],
                frequency=medication_data["frequency"],
                duration=medication_data["duration"],
                instructions=medication_data.get("instructions", ""),
            )
            medications.append(medication)

        return medications
