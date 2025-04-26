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


class ChatbotPermission(permissions.BasePermission):
    """
    Custom permission to handle role-based data access in the chatbot.
    Different roles have different levels of access to data:
    - Manager: Full access to all data
    - Doctor: Access to own patients, appointments, and general medical data
    - Secretary: Limited access to appointments and basic patient info
    """

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

    def get_role_based_data_access(self, user):
        """Define data access permissions based on user role"""
        role = user.role.lower() if hasattr(user, 'role') else 'unknown'
        
        if role == 'manager':
            return {
                'patients': True,  # Full access
                'appointments': True,  # Full access
                'medications': True,  # Full access
                'doctors': True,  # Full access
                'medical_records': True,  # Full access
                'billing': True,  # Full access
                'reports': True  # Full access
            }
        elif role == 'doctor':
            return {
                'patients': 'own',  # Only own patients
                'appointments': 'own',  # Only own appointments
                'medications': True,  # Full access to medications
                'doctors': True,  # Can view all doctors
                'medical_records': 'own',  # Only own patients' records
                'billing': False,  # No access
                'reports': 'own'  # Only own reports
            }
        elif role == 'secretary':
            return {
                'patients': 'basic',  # Basic patient info only
                'appointments': True,  # Full access to appointments
                'medications': False,  # No access
                'doctors': True,  # Can view all doctors
                'medical_records': False,  # No access
                'billing': 'basic',  # Basic billing info
                'reports': False  # No access
            }
        else:
            return {
                'patients': False,
                'appointments': False,
                'medications': False,
                'doctors': False,
                'medical_records': False,
                'billing': False,
                'reports': False
            }

    def filter_data_by_permission(self, user, data_type, data):
        """Filter data based on user's role and permissions"""
        permissions = self.get_role_based_data_access(user)
        access_level = permissions.get(data_type, False)

        if not access_level:
            return []
        
        if access_level is True:  # Full access
            return data
            
        if data_type == 'patients':
            if access_level == 'own':
                # Filter for doctor's own patients
                return [p for p in data if p.get('doctor_id') == user.doctor_profile.id]
            elif access_level == 'basic':
                # Return only basic patient info
                return [{
                    'id': p.get('id'),
                    'name': p.get('name'),
                    'is_active': p.get('is_active')
                } for p in data]
                
        elif data_type == 'appointments':
            if access_level == 'own':
                # Filter for doctor's own appointments
                return [a for a in data if a.get('doctor_id') == user.doctor_profile.id]
                
        elif data_type == 'medical_records':
            if access_level == 'own':
                # Filter for doctor's own patients' records
                return [r for r in data if r.get('doctor_id') == user.doctor_profile.id]
                
        elif data_type == 'reports':
            if access_level == 'own':
                # Filter for doctor's own reports
                return [r for r in data if r.get('doctor_id') == user.doctor_profile.id]
                
        return data  # Default case