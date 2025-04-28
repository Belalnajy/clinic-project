from django.contrib import admin
from .models import Doctor, Specialization

from unfold.admin import ModelAdmin


@admin.register(Doctor)
class CustomAdminClass(ModelAdmin):
    pass

@admin.register(Specialization)
class CustomAdminClass(ModelAdmin):
    pass