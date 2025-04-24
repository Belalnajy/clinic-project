from rest_framework import permissions


class IsManagerOrSecretary(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.role in ["manager", "secretary"]


class IsDoctor(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.role == "doctor"

    def has_object_permission(self, request, view, obj):
        # Doctors can only modify their own appointments
        return obj.doctor == request.user.doctor_profile

class IsSecretary(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.role == "secretary"


class IsManager(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.role == "manager"


class IsDoctorOrManager(permissions.BasePermission):
    """
    Custom permission to allow only doctors and managers to access the resource.
    """

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and (
            request.user.role == "doctor" or request.user.role == "manager"
        )