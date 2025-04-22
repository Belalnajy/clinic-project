from rest_framework import serializers
from .models import Payment

class PaymentSerializer(serializers.ModelSerializer):
    
    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Amount must be greater than zero.")
        return value
    first_name = serializers.CharField(source='patient.first_name', read_only=True)
    last_name = serializers.CharField(source='patient.last_name', read_only=True)
    class Meta:
        model = Payment
        fields = '__all__'