from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

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

    STATUS_CHOICES = [
        ("available", "Available"),
        ("onBreak", "On Break"),
        ("withPatient", "With Patient"),
    ]

    email = models.EmailField(unique=True, verbose_name=_("email address"))
    first_name = models.CharField(max_length=30, blank=True, verbose_name=_("first name"))
    last_name = models.CharField(max_length=30, blank=True, verbose_name=_("last name"))
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True, verbose_name=_("active"))
    date_joined = models.DateTimeField(default=timezone.now, verbose_name=_("date joined"))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_("updated at"))
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, verbose_name=_("role"))
    status = models.CharField(max_length=12, choices=STATUS_CHOICES, default="available", verbose_name=_("status"))

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name", "role"]

    def __str__(self):
        return self.email
