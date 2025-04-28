from djoser.serializers import UserCreateSerializer,SetPasswordSerializer
from django.contrib.auth import get_user_model
from doctors.serializers import DoctorSerializer
from rest_framework.exceptions import ValidationError
from rest_framework import serializers
from doctors.models import Doctor, Specialization

User = get_user_model()

class UserCreateSerializer(UserCreateSerializer):
    """
    Serializer for creating a new user.
    """
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ('id', 'email', 'password', 'first_name', 'last_name', 'role', 'status', 'is_active')
        read_only_fields = ('is_active',)

    def create(self, validated_data):
        """
        Override the create method to handle doctor instance creation.
        """
        user = super().create(validated_data)  # Create the user

        if user.role == 'doctor':  # Check if the user role is 'doctor'
            try:
                from doctors.models import Doctor
                Doctor.objects.create(user=user)  # Create a Doctor instance linked to the user
            except Exception as e:
                raise ValidationError({"doctor": f"Error creating doctor profile: {str(e)}"})

        return user

class CustomSetPasswordSerializer(SetPasswordSerializer):
    def update(self, instance, validated_data):
        password = validated_data.get('new_password')
        instance.set_password(password)
        instance.save()
        return instance

class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for user profile endpoints (/auth/users/me/).
    """
    doctor_profile = serializers.SerializerMethodField()
    available_statuses = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'role', 'status', 'doctor_profile', 'available_statuses')
        read_only_fields = ('email', 'role', 'doctor_profile', 'available_statuses')

    def get_doctor_profile(self, obj):
        if obj.role == 'doctor':
            try:
                doctor = Doctor.objects.get(user=obj)
                return DoctorSerializer(doctor, context=self.context).data
            except Doctor.DoesNotExist:
                return None
        return None

    def get_available_statuses(self, obj):
        """
        Returns the list of available statuses based on user role
        """
        allowed_statuses = obj.get_allowed_statuses()
        return [
            {'value': status, 'label': dict(User.STATUS_CHOICES)[status]}
            for status in allowed_statuses
        ]

    def validate_status(self, value):
        """
        Validate that the status is allowed for the user's role
        """
        if value not in self.instance.get_allowed_statuses():
            raise ValidationError(
                f'Invalid status for {self.instance.role}. '
                f'Allowed statuses are: {", ".join(self.instance.get_allowed_statuses())}'
            )
        return value

    def update(self, instance, validated_data):
        """
        Update the user instance with validated data
        """
        instance = super().update(instance, validated_data)
        instance.clean()  # Run model validation
        return instance
