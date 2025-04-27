from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django.core.exceptions import ValidationError

from .managers import UserManager

class User(AbstractBaseUser, PermissionsMixin):
    """
    Custom user model that uses email as the unique identifier.
    """
    ROLE_CHOICES = [
        ("manager", "Manager"),
        ("doctor", "Doctor"),
        ("secretary", "Secretary"),
    ]

    # Define status choices
    STATUS_AVAILABLE = 'available'
    STATUS_ON_BREAK = 'onBreak'
    STATUS_WITH_PATIENT = 'withPatient'

    STATUS_CHOICES = [
        (STATUS_AVAILABLE, "Available"),
        (STATUS_ON_BREAK, "On Break"),
        (STATUS_WITH_PATIENT, "With Patient"),
    ]

    # Define role-specific status choices
    DOCTOR_STATUS_CHOICES = [STATUS_AVAILABLE, STATUS_ON_BREAK, STATUS_WITH_PATIENT]
    STAFF_STATUS_CHOICES = [STATUS_AVAILABLE, STATUS_ON_BREAK]

    email = models.EmailField(unique=True, verbose_name=_("email address"))
    first_name = models.CharField(max_length=30, blank=True, verbose_name=_("first name"))
    last_name = models.CharField(max_length=30, blank=True, verbose_name=_("last name"))
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True, verbose_name=_("active"))
    date_joined = models.DateTimeField(default=timezone.now, verbose_name=_("date joined"))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_("updated at"))
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, verbose_name=_("role"))
    status = models.CharField(
        max_length=12,
        choices=STATUS_CHOICES,
        default=STATUS_AVAILABLE,
        verbose_name=_("status")
    )

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name", "role"]

    def __str__(self):
        return self.email

    def get_allowed_statuses(self):
        """
        Returns the list of allowed statuses based on user role
        """
        if self.role == 'doctor':
            return self.DOCTOR_STATUS_CHOICES
        return self.STAFF_STATUS_CHOICES

    def clean(self):
        """
        Validate that the status is appropriate for the user's role
        """
        super().clean()
        if self.status not in self.get_allowed_statuses():
            raise ValidationError({
                'status': f'Invalid status for {self.role}. Allowed statuses are: {", ".join(self.get_allowed_statuses())}'
            })

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        self.is_active = False
        self.save()