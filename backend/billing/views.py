from rest_framework import viewsets, permissions, filters
from rest_framework.exceptions import ValidationError
from .models import Payment
from .serializers import PaymentSerializer

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['method','status','amount','patient__first_name','patient__last_name','appointment__id',]


    def perform_create(self, serializer):
        appointment = serializer.validated_data.get('appointment')
        if Payment.objects.filter(appointment=appointment, status='Paid').exists():
            raise ValidationError("This appointment has already been paid for.")
        serializer.save()
