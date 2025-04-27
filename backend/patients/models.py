from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core.validators import MinValueValidator, MinLengthValidator

from phonenumber_field.modelfields import PhoneNumberField
from creditcards.models import CardNumberField

import uuid
from decimal import Decimal

from users.models import User


class Patient(models.Model):
    """
    Model representing a patient.
    """

    GENDER_CHOICES = [
        ("male", "Male"),
        ("female", "Female"),
    ]

    BLOOD_TYPE_CHOICES = [
        ("A+", "A+"),
        ("A-", "A-"),
        ("B+", "B+"),
        ("B-", "B-"),
        ("AB+", "AB+"),
        ("AB-", "AB-"),
        ("O+", "O+"),
        ("O-", "O-"),
        ("unknown", "Unknown"),
    ]

    patient_id = models.UUIDField(
        default=uuid.uuid4, editable=False, unique=True, verbose_name=_("patient ID")
    )
    first_name = models.CharField(max_length=100, verbose_name=_("first name"))
    last_name = models.CharField(max_length=100, verbose_name=_("last name"))
    birth_date = models.DateField(verbose_name=_("birth date"))
    gender = models.CharField(
        max_length=10, choices=GENDER_CHOICES, verbose_name=_("gender")
    )
    email = models.EmailField(
        unique=True, verbose_name=_("email address"), null=True, blank=True
    )
    phone_number = PhoneNumberField(
        verbose_name=_("phone number"), null=True, blank=True
    )
    address = models.CharField(
        max_length=255, verbose_name=_("address"), null=True, blank=True
    )
    city = models.CharField(
        max_length=100, verbose_name=_("city"), null=True, blank=True
    )
    blood_type = models.CharField(
        max_length=7,
        choices=BLOOD_TYPE_CHOICES,
        default="unknown",
        verbose_name=_("blood type"),
        null=True,
        blank=True,
    )
    credit_card_number = CardNumberField(
        verbose_name=_("credit card number"), null=True, blank=True
    )
    height = models.DecimalField(
        verbose_name=_("height (cm)"),
        max_digits=5,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        null=True,
        blank=True,
    )
    weight = models.DecimalField(
        verbose_name=_("weight (kg)"),
        max_digits=6,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        null=True,
        blank=True,
    )
    insurance_provider = models.CharField(
        max_length=255, verbose_name=_("insurance provider"), null=True, blank=True
    )
    insurance_number = models.CharField(
        max_length=255, verbose_name=_("insurance number"), null=True, blank=True
    )
    insurance_expiration_date = models.DateField(
        verbose_name=_("insurance expiration date"), null=True, blank=True
    )
    is_active = models.BooleanField(default=True, verbose_name=_("is active"))
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_("created at"))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_("updated at"))
    created_by = models.ForeignKey(
        User,
        on_delete=models.RESTRICT,
        related_name="patients",
        verbose_name=_("created by"),
    )

    # def get_last_patient_id(start_id :str = "000100") -> str:
    #     try:
    #         last_patient =Patient.object.all.last()
    #         last_id = last_patient.patient_id
    #     except Patient.DoesNotExist:
    #         last_id = None
    #     if last_id is None:
    #         last_id = start_id
    #     return last_id
