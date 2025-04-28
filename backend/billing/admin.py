from django.contrib import admin
from .models import Payment

from unfold.admin import ModelAdmin


@admin.register(Payment)
class CustomAdminClass(ModelAdmin):
    pass