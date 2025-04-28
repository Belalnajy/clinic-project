from django.db import models
from users.models import User


class Specialization(models.Model):
    """
    Model representing a specialization of a doctor.
    """

    name = models.CharField(max_length=100, unique=True)
    description = models.TextField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Doctor(models.Model):
    """
    Model representing a doctor.
    """

    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="doctor_profile"
    )
    specialization = models.ForeignKey(
        Specialization,
        on_delete=models.RESTRICT,
        related_name="doctors",
        null=True,
        blank=True,
    )
    license_number = models.CharField(
        max_length=255, unique=True, null=True, blank=True
    )
    years_of_experience = models.PositiveIntegerField(default=0)
    qualifications = models.TextField(null=True, blank=True)
    bio = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    profile_picture = models.ImageField(
        upload_to="doctor_profile_pictures/", blank=True, null=True
    )

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name}"

    @classmethod
    def get_by_user_id(cls, user_id):
        """
        Get a doctor instance by user_id.

        Args:
            user_id (int): The ID of the user associated with the doctor.

        Returns:
            Doctor: The doctor instance if found, None otherwise.
        """
        try:
            return cls.objects.get(user_id=user_id)
        except cls.DoesNotExist:
            return None
