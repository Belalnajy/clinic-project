from rest_framework import viewsets, permissions, filters
from .models import Doctor, Specialization
from .serializers import DoctorSerializer, SpecializationSerializer


class SpecializationViewSet(viewsets.ModelViewSet):
    queryset = Specialization.objects.all()
    serializer_class = SpecializationSerializer
    permission_classes = [permissions.IsAuthenticated]


class DoctorViewSet(viewsets.ModelViewSet):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    permission_classes = [permissions.IsAuthenticated]
    def perform_create(self, serializer):
          serializer.save(user=self.request.user)
    filter_backends = [filters.SearchFilter]
    search_fields = [ 'user__first_name','user__last_name','user__email','specialization__name']