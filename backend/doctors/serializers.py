from rest_framework import serializers
from .models import Specialization, Doctor
from users.models import User

class SpecializationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Specialization
        fields = '__all__'
class DoctorSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
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
