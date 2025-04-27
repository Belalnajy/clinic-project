from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Doctor, Specialization
from .serializers import (
    DoctorSerializer,
    SpecializationSerializer,
    DoctorRegistrationSerializer,
)
from django.db import transaction
from users.models import User


class SpecializationViewSet(viewsets.ModelViewSet):
    queryset = Specialization.objects.filter(is_active=True).order_by("name")
    serializer_class = SpecializationSerializer
    # permission_classes = [permissions.IsAuthenticated]

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class DoctorViewSet(viewsets.ModelViewSet):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    # permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    filter_backends = [filters.SearchFilter]
    search_fields = [
        "user__first_name",
        "user__last_name",
        "user__email",
        "specialization__name",
    ]

    @action(detail=False, methods=["get"])
    def by_user_id(self, request):
        user_id = request.query_params.get("user_id")
        if not user_id:
            return Response(
                {"error": "user_id parameter is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            doctor = Doctor.get_by_user_id(user_id)
            if doctor:
                serializer = self.get_serializer(doctor)
                return Response(serializer.data)
            return Response(
                {"error": "Doctor not found"}, status=status.HTTP_404_NOT_FOUND
            )
        except ValueError:
            return Response(
                {"error": "Invalid user_id format"}, status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=False, methods=["post"])
    def register(self, request):
        serializer = DoctorRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            try:
                with transaction.atomic():
                    # Create user with doctor role
                    user_data = {
                        "email": serializer.validated_data["email"],
                        "password": serializer.validated_data["password"],
                        "first_name": serializer.validated_data["first_name"],
                        "last_name": serializer.validated_data["last_name"],
                        "role": "doctor",
                    }
                    user = User.objects.create_user(**user_data)

                    # Create doctor profile
                    doctor_data = {
                        "user": user,
                        "specialization": serializer.validated_data.get(
                            "specialization"
                        ),
                        "license_number": serializer.validated_data.get(
                            "license_number"
                        ),
                        "years_of_experience": serializer.validated_data.get(
                            "years_of_experience"
                        ),
                        "qualifications": serializer.validated_data.get(
                            "qualifications"
                        ),
                        "bio": serializer.validated_data.get("bio"),
                        "profile_picture": serializer.validated_data.get(
                            "profile_picture"
                        ),
                    }
                    doctor = Doctor.objects.create(**doctor_data)

                    # Return the created doctor data
                    response_serializer = DoctorSerializer(doctor)
                    return Response(
                        response_serializer.data, status=status.HTTP_201_CREATED
                    )
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)