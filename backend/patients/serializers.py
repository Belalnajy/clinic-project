from rest_framework import serializers
from .models import Patient
from phonenumber_field.serializerfields import PhoneNumberField
from django.core.validators import MinValueValidator
from decimal import Decimal
from django.utils import timezone


class PatientSerializer(serializers.ModelSerializer):
    """
    Serializer for Patient model.
    """

    phone_number = PhoneNumberField(required=False, allow_null=True)
    credit_card_number = serializers.CharField(required=False, allow_null=True)
    height = serializers.DecimalField(
        max_digits=5,
        decimal_places=2,
        validators=[MinValueValidator(Decimal("0"))],
        required=False,
        allow_null=True,
    )
    weight = serializers.DecimalField(
        max_digits=6,
        decimal_places=2,
        validators=[MinValueValidator(Decimal("0"))],
        required=False,
        allow_null=True,
    )

    class Meta:
        model = Patient
        fields = "__all__"
        read_only_fields = ["patient_id", "created_at", "updated_at", "created_by"]

    def validate(self, data):
        """
        Custom validation for patient data
        """
        # Validate birth date is not in the future
        if "birth_date" in data and data["birth_date"] > timezone.now().date():
            raise serializers.ValidationError("Birth date cannot be in the future")

        # Validate insurance expiration date is not in the past
        if "insurance_expiration_date" in data and data["insurance_expiration_date"]:
            if data["insurance_expiration_date"] < timezone.now().date():
                raise serializers.ValidationError(
                    "Insurance expiration date cannot be in the past"
                )

        # Validate height and weight if both are provided
        if (
            "height" in data
            and "weight" in data
            and data["height"] is not None
            and data["weight"] is not None
        ):
            height = float(data["height"])
            weight = float(data["weight"])

            if height == 0 or weight == 0:
                raise serializers.ValidationError("Height and weight cannot be zero")

            if height > 0 and weight > 0:
                bmi = weight / ((height / 100) ** 2)
                if bmi < 10 or bmi > 60:
                    raise serializers.ValidationError(
                        "Invalid height and weight combination"
                    )

        return data

    def validate_email(self, value):
        """
        Validate email format and uniqueness
        """
        if (
            value
            and Patient.objects.filter(email=value)
            .exclude(pk=self.instance.pk if self.instance else None)
            .exists()
        ):
            raise serializers.ValidationError(
                "A patient with this email already exists"
            )
        return value

    def validate_phone_number(self, value):
        """
        Validate phone number format
        """
        if (
            value
            and Patient.objects.filter(phone_number=value)
            .exclude(pk=self.instance.pk if self.instance else None)
            .exists()
        ):
            raise serializers.ValidationError(
                "A patient with this phone number already exists"
            )
        return value
