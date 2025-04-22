from rest_framework import serializers
from .models import Specialization, Doctor
from users.models import User

class SpecializationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Specialization
        fields = '__all__'
    def validate_name(self, value):
        value = value.strip()
        if len(value) < 3:
            raise serializers.ValidationError("Specialization name must be at least 3 characters long.")
        
        if Specialization.objects.filter(name__iexact=value).exists():
            raise serializers.ValidationError("A specialization with this name already exists.")
        return value

    def validate_description(self, value):
        if len(value.strip()) < 10:
            raise serializers.ValidationError("Description must be at least 10 characters long.")
        return value
class DoctorSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    specialization = SpecializationSerializer(read_only=True)
    specialization_id = serializers.PrimaryKeyRelatedField(
        queryset=Specialization.objects.filter(is_active=True),
        write_only=True,
        source='specialization'
    )
    class Meta:
        model = Doctor
        fields = [
            'id', 'user', 'specialization', 'specialization_id', 'license_number',
            'years_of_experience', 'qualifications', 'bio', 'profile_picture',
            'created_at', 'updated_at'
        ]
    def validate_license_number(self, value):
        if Doctor.objects.filter(license_number=value).exists():
            raise serializers.ValidationError("This license number is already in use.")
        return value
    def validate_years_of_experience(self, value):
        if value < 0 or value >= 60:
            raise serializers.ValidationError("Years of experience must be between 0 and 60.")
        return value
    def validate_qualifications(self, value):
        if len(value) < 5:
            raise serializers.ValidationError("Qualifications must be at least 5 characters long.")
        return value

    def validate_bio(self, value):
        if len(value.strip()) < 10:
            raise serializers.ValidationError("Bio must be at least 10 characters long.")
        return value
    def validate_profile_picture(self, value):
        max_size = 2 * 1024 * 1024  # 2MB
        if value and value.size > max_size:
            raise serializers.ValidationError("Profile picture size must not exceed 2MB.")
        return value
    def validate(self, data):
        user = self.context['request'].user
        if self.instance is None and Doctor.objects.filter(user=user).exists():
            raise serializers.ValidationError("This user already has a doctor profile.")
        return data

