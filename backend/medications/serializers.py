from rest_framework import serializers
from .models import Medication

class MedicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medication
        fields = '__all__'

    def validate_name(self, value):
        if Medication.objects.filter(name__iexact=value).exists():
            raise serializers.ValidationError("A medication with this name already exists.")
        return value

    def validate(self, data):
        if not data.get("name"):
            raise serializers.ValidationError({"name": "Medication name is required."})
        if len(data.get("name", "")) < 3:
            raise serializers.ValidationError({"name": "Medication name must be at least 3 characters long."})
        return data
