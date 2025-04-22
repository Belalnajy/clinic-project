from rest_framework import serializers
from .models import Payment

class PaymentSerializer(serializers.ModelSerializer):
    
    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Amount must be greater than zero.")
        return value

    class Meta:
        model = Payment
        fields = '__all__'
