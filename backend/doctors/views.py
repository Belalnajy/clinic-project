from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.core.cache import cache
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from .models import Doctor, Specialization
from .serializers import DoctorSerializer, SpecializationSerializer, DoctorRegistrationSerializer
from django.db import transaction
from users.models import User
import logging

logger = logging.getLogger(__name__)

class SpecializationViewSet(viewsets.ModelViewSet):
    queryset = Specialization.objects.filter(is_active=True).order_by('name')
    serializer_class = SpecializationSerializer
    # permission_classes = [permissions.IsAuthenticated]

    @method_decorator(cache_page(60 * 15))  # Cache for 15 minutes
    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Error fetching specializations: {str(e)}", exc_info=True)
            return Response(
                {'error': 'Failed to fetch specializations'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class DoctorViewSet(viewsets.ModelViewSet):
    queryset = Doctor.objects.all()  # Required for DRF router
    serializer_class = DoctorSerializer
    # permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Doctor.objects.select_related('user', 'specialization').all()
    
    def perform_create(self, serializer):
        try:
            serializer.save(user=self.request.user)
        except Exception as e:
            logger.error(f"Error creating doctor profile: {str(e)}", exc_info=True)
            raise
    
    filter_backends = [filters.SearchFilter]
    search_fields = ['user__first_name','user__last_name','user__email','specialization__name']

    def update(self, request, *args, **kwargs):
        try:
            response = super().update(request, *args, **kwargs)
            instance = self.get_object()
            serializer = self.get_serializer(instance)
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Error updating doctor profile: {str(e)}", exc_info=True)
            return Response(
                {'error': 'Failed to update doctor profile', 'detail': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=False, methods=['post'])
    def register(self, request):
        serializer = DoctorRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            try:
                with transaction.atomic():
                    # Create user with doctor role
                    user_data = {
                        'email': serializer.validated_data['email'],
                        'password': serializer.validated_data['password'],
                        'first_name': serializer.validated_data['first_name'],
                        'last_name': serializer.validated_data['last_name'],
                        'role': 'doctor'
                    }
                    user = User.objects.create_user(**user_data)
                    
                    # Create doctor profile
                    doctor_data = {
                        'user': user,
                        'specialization': serializer.validated_data.get('specialization'),
                        'license_number': serializer.validated_data.get('license_number'),
                        'years_of_experience': serializer.validated_data.get('years_of_experience'),
                        'qualifications': serializer.validated_data.get('qualifications'),
                        'bio': serializer.validated_data.get('bio'),
                        'profile_picture': serializer.validated_data.get('profile_picture')
                    }
                    doctor = Doctor.objects.create(**doctor_data)
                    
                    # Return the created doctor data
                    response_serializer = DoctorSerializer(doctor)
                    return Response(response_serializer.data, status=status.HTTP_201_CREATED)
            except Exception as e:
                logger.error(f"Error registering doctor: {str(e)}", exc_info=True)
                return Response(
                    {'error': str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)