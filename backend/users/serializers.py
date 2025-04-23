from djoser.serializers import UserCreateSerializer,SetPasswordSerializer
from django.contrib.auth import get_user_model
from doctors.serializers import DoctorSerializer
from rest_framework.exceptions import ValidationError

User = get_user_model()

class UserCreateSerializer(UserCreateSerializer):
    """
    Serializer for creating a new user.
    """
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ('id', 'email', 'password', 'first_name', 'last_name', 'role', 'status')

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
