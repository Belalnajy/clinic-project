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
