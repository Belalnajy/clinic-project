from rest_framework import viewsets, permissions
from rest_framework.exceptions import ValidationError
from .models import Payment
from .serializers import PaymentSerializer

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        appointment = serializer.validated_data.get('appointment')
        if Payment.objects.filter(appointment=appointment, status='Paid').exists():
            raise ValidationError("This appointment has already been paid for.")

        serializer.save()
