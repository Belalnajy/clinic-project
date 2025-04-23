from rest_framework import serializers
from django.utils import timezone
from django.core.exceptions import ValidationError
from .models import Appointment
from patients.models import Patient
from doctors.models import Doctor


class SimplePatientSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    patient_id = serializers.UUIDField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    birth_date = serializers.DateField()
    gender = serializers.CharField()
    email = serializers.EmailField(allow_null=True)
    phone_number = serializers.CharField(allow_null=True)
    address = serializers.CharField(allow_null=True)
    city = serializers.CharField(allow_null=True)
    blood_type = serializers.CharField(allow_null=True)
    height = serializers.DecimalField(max_digits=5, decimal_places=2, allow_null=True)
    weight = serializers.DecimalField(max_digits=6, decimal_places=2, allow_null=True)
    insurance_provider = serializers.CharField(allow_null=True)
    insurance_number = serializers.CharField(allow_null=True)
    insurance_expiration_date = serializers.DateField(allow_null=True)
    is_active = serializers.BooleanField()


class SimpleDoctorSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    first_name = serializers.CharField(source="user.first_name")
    last_name = serializers.CharField(source="user.last_name")
    specialization = serializers.CharField(source="specialization.name")
    license_number = serializers.CharField()
    years_of_experience = serializers.IntegerField()
    qualifications = serializers.CharField()
    bio = serializers.CharField()
    is_active = serializers.BooleanField(source="user.is_active")


class SimpleUserSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    email = serializers.EmailField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    role = serializers.CharField()
    status = serializers.CharField()
    is_active = serializers.BooleanField()


class PatientChoiceField(serializers.PrimaryKeyRelatedField):
    def display_value(self, instance):
        return f"{instance.first_name} {instance.last_name}"


class DoctorChoiceField(serializers.PrimaryKeyRelatedField):
    def display_value(self, instance):
        return f"{instance.user.first_name} {instance.user.last_name} ({instance.specialization.name})"


class AppointmentSerializer(serializers.ModelSerializer):
    patient_name = serializers.SerializerMethodField()
    doctor_name = serializers.SerializerMethodField()
    created_by_name = serializers.SerializerMethodField()

    # Nested serializers for related fields
    patient = SimplePatientSerializer(read_only=True)
    doctor = SimpleDoctorSerializer(read_only=True)
    created_by = SimpleUserSerializer(read_only=True)

    # Add writeable fields for patient and doctor
    patient_id = PatientChoiceField(
        queryset=Patient.objects.filter(is_active=True),
        source="patient",
        write_only=True,
    )
    doctor_id = DoctorChoiceField(
        queryset=Doctor.objects.filter(user__is_active=True),
        source="doctor",
        write_only=True,
    )

    class Meta:
        model = Appointment
        fields = [
            "appointment_id",
            "patient",
            "doctor",
            "patient_id",
            "doctor_id",
            "appointment_date",
            "appointment_time",
            "duration",
            "status",
            "notes",
            "is_active",
            "created_by",
            "created_at",
            "updated_at",
            "patient_name",
            "doctor_name",
            "created_by_name",
        ]
        read_only_fields = [
            "appointment_id",
            "status",
            "is_active",
            "created_by",
            "created_at",
            "updated_at",
            "doctor_name",
            "created_by_name",
            "patient",
            "doctor",
            "created_by",
        ]

    def get_patient_name(self, obj):
        return f"{obj.patient.first_name} {obj.patient.last_name}"

    def get_doctor_name(self, obj):
        return f"{obj.doctor.user.first_name} {obj.doctor.user.last_name}"

    def get_created_by_name(self, obj):
        return f"{obj.created_by.first_name} {obj.created_by.last_name}"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Get the request from the context
        request = self.context.get("request", None)
        if request and request.user and request.user.role == "doctor":
            # Remove doctor field from fields list for doctor users
            self.fields.pop("doctor")
            self.fields.pop("doctor_id")

    def validate_appointment_date(self, value):
        if value < timezone.now().date():
            raise serializers.ValidationError("Cannot create appointment in the past")
        return value

    def validate(self, data):
        appointment_date = data.get("appointment_date")
        appointment_time = data.get("appointment_time")
        duration = data.get("duration", 30)
        patient = data.get("patient")
        doctor = data.get("doctor")

        # Get the request from the context
        request = self.context.get("request", None)
        if request and request.user and request.user.role == "doctor":
            # For doctors, automatically set themselves as the doctor
            if not hasattr(request.user, "doctor_profile"):
                raise serializers.ValidationError(
                    {
                        "doctor": "Your doctor profile is not set up. Please contact the administrator to complete your doctor profile setup."
                    }
                )
            data["doctor"] = request.user.doctor_profile
            doctor = data["doctor"]

        if appointment_date and appointment_time:
            # Convert to datetime for comparison
            appointment_datetime = timezone.make_aware(
                timezone.datetime.combine(appointment_date, appointment_time)
            )
            end_time = appointment_datetime + timezone.timedelta(minutes=duration)

            # Check for overlapping appointments for doctor
            doctor_overlaps = (
                Appointment.objects.filter(
                    doctor=doctor,
                    appointment_date=appointment_date,
                    is_active=True,
                )
                .exclude(
                    appointment_id=(
                        self.instance.appointment_id if self.instance else None
                    )
                )
                .filter(
                    appointment_time__lt=end_time.time(),
                    appointment_time__gte=appointment_time,
                )
            )

            if doctor_overlaps.exists():
                raise serializers.ValidationError(
                    {
                        "appointment_time": "Doctor already has an appointment at this time"
                    }
                )

            # Check for overlapping appointments for patient
            patient_overlaps = (
                Appointment.objects.filter(
                    patient=patient, appointment_date=appointment_date, is_active=True
                )
                .exclude(
                    appointment_id=(
                        self.instance.appointment_id if self.instance else None
                    )
                )
                .filter(
                    appointment_time__lt=end_time.time(),
                    appointment_time__gte=appointment_time,
                )
            )

            if patient_overlaps.exists():
                raise serializers.ValidationError(
                    {
                        "appointment_time": "Patient already has an appointment at this time"
                    }
                )

        return data
