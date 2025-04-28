from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User
from django import forms

class UserAdminForm(forms.ModelForm):
    class Meta:
        model = User
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Get the instance if it exists (for editing)
        instance = kwargs.get('instance')
        
        # If we have an instance (editing) or if we're creating a new user
        if 'role' in self.fields:
            # If editing an existing user, show only appropriate status choices
            if instance:
                if instance.role != 'doctor':
                    # For non-doctors, remove 'withPatient' from choices
                    status_choices = [
                        (status, label) 
                        for status, label in User.STATUS_CHOICES 
                        if status != User.STATUS_WITH_PATIENT
                    ]
                    self.fields['status'].choices = status_choices
            else:
                # For new users, update status choices when role changes
                self.fields['status'].choices = User.STATUS_CHOICES

class UserAdmin(BaseUserAdmin):
    form = UserAdminForm
    list_display = ('email', 'first_name', 'last_name', 'role', 'status', 'is_active', 'is_staff')
    list_filter = ('role', 'status', 'is_active', 'is_staff')
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name')}),
        ('Permissions', {'fields': ('role', 'status', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'first_name', 'last_name', 'role', 'status'),
        }),
    )
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('email',)

    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        if obj and obj.role != 'doctor' and 'status' in form.base_fields:
            # Remove 'withPatient' from choices for non-doctors
            status_choices = [
                (status, label) 
                for status, label in User.STATUS_CHOICES 
                if status != User.STATUS_WITH_PATIENT
            ]
            form.base_fields['status'].choices = status_choices
        return form

admin.site.register(User, UserAdmin)