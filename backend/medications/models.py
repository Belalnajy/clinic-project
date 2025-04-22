from django.db import models


class Medication(models.Model):
    """
    Model representing a medication.
    """

    name = models.CharField(max_length=255, verbose_name="name")
    default_dosage = models.CharField(max_length=255, verbose_name="default dosage", null=True, blank=True)
    description = models.TextField(verbose_name="description", null=True, blank=True)
    is_active = models.BooleanField(default=True, verbose_name="is active")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="created at")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="updated at")

    def __str__(self):
        return self.name
