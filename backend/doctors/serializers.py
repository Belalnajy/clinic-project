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

class DoctorRegistrationSerializer(serializers.Serializer):
    # User fields
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    
    # Doctor fields
    specialization = serializers.PrimaryKeyRelatedField(
        queryset=Specialization.objects.filter(is_active=True),
        required=False,
        allow_null=True
    )
    license_number = serializers.CharField(required=False, allow_null=True)
    years_of_experience = serializers.IntegerField(required=False, allow_null=True)
    qualifications = serializers.CharField(required=False, allow_null=True)
    bio = serializers.CharField(required=False, allow_null=True)
    profile_picture = serializers.ImageField(required=False, allow_null=True)

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def validate_license_number(self, value):
        if value and Doctor.objects.filter(license_number=value).exists():
            raise serializers.ValidationError("This license number is already in use.")
        return value

    def validate_years_of_experience(self, value):
        if value is not None and (value < 0 or value >= 60):
            raise serializers.ValidationError("Years of experience must be between 0 and 60.")
        return value

    def validate_qualifications(self, value):
        if value and len(value) < 5:
            raise serializers.ValidationError("Qualifications must be at least 5 characters long.")
        return value

    def validate_bio(self, value):
        if value and len(value.strip()) < 10:
            raise serializers.ValidationError("Bio must be at least 10 characters long.")
        return value

class DoctorSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    specialization = SpecializationSerializer(read_only=True)
    specialization_id = serializers.PrimaryKeyRelatedField(
        queryset=Specialization.objects.filter(is_active=True),
        write_only=True,
        source='specialization',
        required=False,
        allow_null=True
    )
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    is_active = serializers.BooleanField(source='user.is_active')
    
    class Meta:
        model = Doctor
        fields = [
            'id', 'user','first_name','last_name','specialization', 'specialization_id', 'license_number',
            'years_of_experience', 'qualifications', 'bio', 'profile_picture', 'is_active',
            'created_at', 'updated_at'
        ]
    
    def validate_license_number(self, value):
        if value and Doctor.objects.filter(license_number=value).exists():
            raise serializers.ValidationError("This license number is already in use.")
        return value
    
    def validate_years_of_experience(self, value):
        if value is not None and (value < 0 or value >= 60):
            raise serializers.ValidationError("Years of experience must be between 0 and 60.")
        return value
    
    def validate_qualifications(self, value):
        if value and len(value) < 5:
            raise serializers.ValidationError("Qualifications must be at least 5 characters long.")
        return value

    def validate_bio(self, value):
        if value and len(value.strip()) < 10:
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

    def update(self, instance, validated_data):
        if 'user' in validated_data and 'is_active' in validated_data['user']:
            user = instance.user
            user.is_active = validated_data['user']['is_active']
            user.save()
            validated_data.pop('user')
        return super().update(instance, validated_data)

