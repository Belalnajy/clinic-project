import os
import json
import re
from datetime import timedelta
from typing import Dict
from django.utils import timezone
from django.core.cache import cache
from django.db.models import Q
from django.db import connection
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.throttling import UserRateThrottle
from openai import OpenAI
from .models import ChatMessage
from .medical_analysis import MedicalAnalysis
from patients.models import Patient
from appointments.models import Appointment
from doctors.models import Doctor
from medications.models import Medication
from medical_records.models import MedicalRecord
import logging
from rest_framework.pagination import PageNumberPagination
from dotenv import load_dotenv
from django.conf import settings
from core.permissions import ChatbotPermission

# Load environment variables
load_dotenv()

logger = logging.getLogger(__name__)

# Initialize OpenAI client with API key from .env
OPENAI_KEY = os.getenv("OPENAI_KEY")
if not OPENAI_KEY:
    raise ValueError("OPENAI_KEY environment variable is required")

client = OpenAI(api_key=OPENAI_KEY)

# OpenAI model configuration
CHAT_MODEL = "gpt-4o-mini"  # Using the newer model
IMAGE_MODEL = "dall-e-3"  # Keep DALL-E 3 for image generation


class DatabaseTestView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            # Test database connection
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
                result = cursor.fetchone()

            # Test model access
            test_message = ChatMessage.objects.create(
                user=request.user, role="system", content="Database test message"
            )
            test_message.delete()  # Clean up

            return Response(
                {
                    "status": "success",
                    "message": "Database connection and model access working correctly",
                }
            )
        except Exception as e:
            return Response(
                {"status": "error", "message": f"Database test failed: {str(e)}"},
                status=500,
            )


class ChatThrottle(UserRateThrottle):
    rate = "30/minute"


class ChatMessagePagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = "page_size"
    max_page_size = 100


class ChatAPIView(APIView):
    permission_classes = [IsAuthenticated, ChatbotPermission]
    throttle_classes = [ChatThrottle]
    pagination_class = ChatMessagePagination

    def __init__(self):
        super().__init__()
        self.medical_analysis = MedicalAnalysis()
        self.permission_handler = ChatbotPermission()

    def is_image_request(self, message):
        """Check if the message is requesting image generation."""
        image_triggers = [
            r"^draw\s",
            r"^imagine\s",
            r"^picture\sof\s",
            r"^generate\s.*\simage",
            r"^create\s.*\simage",
            r"^show\s.*\simage",
            r".*\svisualization\sof\s",
        ]
        return any(re.match(pattern, message.lower()) for pattern in image_triggers)

    def sanitize_image_prompt(self, message):
        """Sanitize and enhance the image generation prompt."""
        # Remove any potentially problematic characters
        sanitized = re.sub(r"[^\w\s,.!?()-]", "", message)

        # Add style modifiers for better quality if not present
        style_modifiers = [
            "high quality",
            "detailed",
            "professional",
            "medical illustration style",
            "clean background",
        ]

        # Check if any style modifier is already present
        has_modifier = any(
            modifier.lower() in message.lower() for modifier in style_modifiers
        )

        if not has_modifier:
            sanitized += (
                ", high quality, detailed, professional medical illustration style"
            )

        return sanitized

    def generate_image(self, prompt):
        """Generate image using OpenAI's DALL-E model."""
        try:
            sanitized_prompt = self.sanitize_image_prompt(prompt)

            response = client.images.generate(
                model=IMAGE_MODEL,
                prompt=sanitized_prompt,
                size="1024x1024",
                quality="standard",
                n=1,
            )

            return {
                "success": True,
                "url": response.data[0].url,
                "revised_prompt": response.data[0].revised_prompt,
            }
        except Exception as e:
            return {"success": False, "error": str(e)}

    def get(self, request):
        """Get chat history for the authenticated user with pagination"""
        try:
            # Get query parameters
            page = request.query_params.get("page", 1)
            page_size = request.query_params.get("page_size", 20)
            days = request.query_params.get("days", 30)  # Default to last 30 days

            # Calculate date range
            end_date = timezone.now()
            start_date = end_date - timedelta(days=int(days))

            # Get messages with date filtering, ordered by timestamp descending
            messages = ChatMessage.objects.filter(
                user=request.user, timestamp__range=(start_date, end_date)
            ).order_by("-timestamp")

            # Paginate the results
            paginator = self.pagination_class()
            paginated_messages = paginator.paginate_queryset(messages, request)

            # Format messages for response
            formatted_messages = [
                {
                    "id": msg.id,
                    "role": msg.role,
                    "content": msg.content,
                    "timestamp": msg.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
                    "is_error": (
                        "Error:" in msg.content if msg.role == "assistant" else False
                    ),
                }
                for msg in paginated_messages
            ]

            return Response(
                {
                    "messages": formatted_messages,
                    "pagination": {
                        "total": paginator.page.paginator.count,
                        "page": paginator.page.number,
                        "page_size": paginator.page_size,
                        "total_pages": paginator.page.paginator.num_pages,
                        "has_next": paginator.page.has_next(),
                        "has_previous": paginator.page.has_previous(),
                    },
                }
            )
        except Exception as e:
            return Response({"error": "Failed to fetch chat history"}, status=500)

    def query_patients(self, query_params=None, user=None):
        """Query patient data based on parameters and user permissions"""
        try:
            query = Patient.objects.all()

            # Only apply filters if query_params exists and has non-empty values
            if query_params and isinstance(query_params, dict):
                name = (query_params.get("name") or "").strip()
                patient_id = (query_params.get("id") or "").strip()

                if name:
                    query = query.filter(
                        Q(first_name__icontains=name) | Q(last_name__icontains=name)
                    )
                if patient_id:
                    query = query.filter(patient_id__icontains=patient_id)

            # Apply role-based filtering
            if user and user.role == "doctor":
                query = query.filter(doctor=user.doctor_profile)

            patients = query.order_by("-created_at")[:10]

            # Convert to list of dicts
            patient_data = [
                {
                    "id": str(p.patient_id),
                    "name": f"{p.first_name} {p.last_name}",
                    "gender": p.gender,
                    "blood_type": p.blood_type,
                    "is_active": p.is_active,
                    "doctor_id": p.doctor.id if hasattr(p, "doctor") else None,
                }
                for p in patients
            ]

            # Filter based on permissions
            return self.permission_handler.filter_data_by_permission(
                user, "patients", patient_data
            )

        except Exception as e:
            return []

    def query_appointments(self, query_params=None, user=None):
        """Query appointment data based on parameters and user permissions"""
        try:
            query = Appointment.objects.select_related(
                "patient", "doctor__user"
            ).filter(is_active=True)

            # Only apply filters if query_params exists and has non-empty values
            if query_params and isinstance(query_params, dict):
                patient = (query_params.get("patient") or "").strip()
                doctor = (query_params.get("doctor") or "").strip()

                if patient:
                    query = query.filter(
                        Q(patient__first_name__icontains=patient)
                        | Q(patient__last_name__icontains=patient)
                    )
                if doctor:
                    query = query.filter(
                        Q(doctor__user__first_name__icontains=doctor)
                        | Q(doctor__user__last_name__icontains=doctor)
                    )

            # Apply role-based filtering
            if user and user.role == "doctor":
                query = query.filter(doctor=user.doctor_profile)

            appointments = query.order_by("appointment_date", "appointment_time")[:10]

            # Convert to list of dicts
            appointment_data = [
                {
                    "patient": f"{a.patient.first_name} {a.patient.last_name}",
                    "doctor": f"{a.doctor.user.first_name} {a.doctor.user.last_name}",
                    "date": a.appointment_date.strftime("%Y-%m-%d"),
                    "time": a.appointment_time.strftime("%H:%M"),
                    "duration": f"{a.duration} minutes",
                    "status": a.status.title(),
                    "notes": a.notes if a.notes else "No notes",
                    "doctor_id": a.doctor.id,
                }
                for a in appointments
            ]

            # Filter based on permissions
            return self.permission_handler.filter_data_by_permission(
                user, "appointments", appointment_data
            )

        except Exception as e:
            return []

    def query_medications(self, query_params=None, user=None):
        """Query medication data based on parameters and user permissions"""
        try:
            query = Medication.objects.all()

            # Only apply filters if query_params exists and has non-empty values
            if query_params and isinstance(query_params, dict):
                name = (query_params.get("name") or "").strip()
                category = (query_params.get("category") or "").strip()

                if name:
                    query = query.filter(name__icontains=name)
                if category:
                    query = query.filter(category__icontains=category)

            medications = query.order_by("name")[:10]

            # Convert to list of dicts
            medication_data = [
                {"name": m.name, "category": m.category, "description": m.description}
                for m in medications
            ]

            # Filter based on permissions
            return self.permission_handler.filter_data_by_permission(
                user, "medications", medication_data
            )

        except Exception as e:
            return []

    def query_doctors(self, query_params=None, user=None):
        """Query doctor data based on parameters and user permissions"""
        try:
            query = Doctor.objects.select_related("user", "specialization").filter(
                user__is_active=True
            )

            # Only apply filters if query_params exists and has non-empty values
            if query_params and isinstance(query_params, dict):
                name = (query_params.get("name") or "").strip()
                specialization = (query_params.get("specialization") or "").strip()

                if name:
                    query = query.filter(
                        Q(user__first_name__icontains=name)
                        | Q(user__last_name__icontains=name)
                    )
                if specialization:
                    query = query.filter(specialization__name__icontains=specialization)

            doctors = query.order_by("user__first_name")[:10]

            # Convert to list of dicts
            doctor_data = [
                {
                    "name": f"{d.user.first_name} {d.user.last_name}",
                    "specialization": (
                        d.specialization.name if d.specialization else "General"
                    ),
                    "license_number": d.license_number,
                    "is_active": d.user.is_active,
                    "id": d.id,
                }
                for d in doctors
            ]

            # Filter based on permissions
            return self.permission_handler.filter_data_by_permission(
                user, "doctors", doctor_data
            )

        except Exception as e:
            return []

    def process_medical_request(self, message: str, user) -> Dict:
        """Process medical-related requests"""
        try:
            # Check if it's a report analysis request
            if re.search(r"analyze.*report|report.*analysis", message.lower()):
                # Extract report text from message
                report_text = re.sub(
                    r"analyze.*report|report.*analysis",
                    "",
                    message,
                    flags=re.IGNORECASE,
                ).strip()
                if report_text:
                    analysis = self.medical_analysis.analyze_medical_report(report_text)
                    return {
                        "success": True,
                        "type": "report_analysis",
                        "content": analysis["analysis"],
                    }

            # Check if it's a data visualization request
            if re.search(r"visualize.*data|data.*visualization", message.lower()):
                # Extract data from message
                data_match = re.search(r"\{.*\}", message)
                if data_match:
                    try:
                        data = json.loads(data_match.group())
                        visualization = (
                            self.medical_analysis.generate_medical_visualization(data)
                        )
                        return {
                            "success": True,
                            "type": "visualization",
                            "content": visualization["url"],
                        }
                    except json.JSONDecodeError:
                        pass

            # Check if it's a data summary request
            if re.search(r"summarize.*data|data.*summary", message.lower()):
                # Extract data from message
                data_match = re.search(r"\[.*\]", message)
                if data_match:
                    try:
                        data = json.loads(data_match.group())
                        summary = self.medical_analysis.summarize_medical_data(data)
                        return {
                            "success": True,
                            "type": "data_summary",
                            "content": summary["summary"],
                        }
                    except json.JSONDecodeError:
                        pass

            return {"success": False, "error": "Could not process medical request"}
        except Exception as e:
            return {"success": False, "error": str(e)}

    def post(self, request):
        """Handle chat messages and process medical requests"""
        try:
            message = request.data.get("message", "").strip()
            if not message:
                return Response({"error": "Message is required"}, status=400)

            # Check if it's a medical-related request
            medical_response = self.process_medical_request(message, request.user)
            if medical_response["success"]:
                # Create chat message for the response
                chat_message = ChatMessage.objects.create(
                    user=request.user,
                    role="assistant",
                    content=medical_response["content"],
                    metadata={
                        "type": medical_response["type"],
                        "timestamp": timezone.now().isoformat(),
                    },
                )

                return Response(
                    {
                        "message": {
                            "id": chat_message.id,
                            "role": chat_message.role,
                            "content": chat_message.content,
                            "timestamp": chat_message.timestamp.strftime(
                                "%Y-%m-%d %H:%M:%S"
                            ),
                            "metadata": chat_message.metadata,
                        }
                    }
                )

            # Handle regular chat messages
            uploaded_image = request.FILES.get("image")
            is_regenerate = request.data.get("is_regenerate", False)

            if not message and not uploaded_image:
                return Response({"error": "Message or image is required."}, status=400)

            user = request.user
            name = user.first_name or user.username or "User"
            role = getattr(user, "role", "Unknown Role")

            # Handle image upload
            if uploaded_image:
                try:
                    # Validate image file type
                    allowed_types = ["image/jpeg", "image/png", "image/dicom"]
                    if uploaded_image.content_type not in allowed_types:
                        return Response(
                            {
                                "error": "Invalid file type. Please upload a JPEG, PNG, or DICOM image.",
                                "show_default_message": False,
                            },
                            status=400,
                        )

                    # Check file size (limit to 10MB)
                    if uploaded_image.size > 10 * 1024 * 1024:
                        return Response(
                            {
                                "error": "File size too large. Please upload an image smaller than 10MB.",
                                "show_default_message": False,
                            },
                            status=400,
                        )

                    # Store user message with image
                    user_message = ChatMessage.objects.create(
                        user=user,
                        role="user",
                        content=message or "Image uploaded",
                        uploaded_image=uploaded_image,
                    )

                    # Prepare image analysis prompt
                    image_prompt = (
                        f"I'm a medical professional examining an uploaded image. "
                        f"The user's message: {message if message else 'Please analyze this image'}\n\n"
                        f"The image has been uploaded and is available at: {user_message.uploaded_image.url}\n\n"
                        f"Guidelines for analysis:\n"
                        f"1. Describe what you see in the image\n"
                        f"2. If it's a medical image, provide relevant medical context\n"
                        f"3. Note any concerning findings\n"
                        f"4. Suggest next steps if appropriate\n"
                        f"5. Maintain medical professionalism and accuracy"
                    )

                    # Get AI response for the image
                    response = client.chat.completions.create(
                        model=CHAT_MODEL,
                        messages=[{"role": "user", "content": image_prompt}],
                        max_tokens=800,
                        temperature=0.7,
                    )

                    answer = response.choices[0].message.content.strip()

                    # Store assistant response
                    assistant_message = ChatMessage.objects.create(
                        user=user, role="assistant", content=answer
                    )

                    return Response(
                        {
                            "response": answer,
                            "image_url": user_message.uploaded_image.url,
                            "has_image": True,
                            "show_default_message": False,
                        }
                    )

                except Exception as e:

                    # Determine if this is a temporary processing issue or a permanent failure
                    if "OpenAI API" in str(e) or "network" in str(e).lower():
                        error_msg = "Temporary issue with image processing. Please try again in a few moments."
                    elif "OCR" in str(e) or "pytesseract" in str(e):
                        error_msg = "Unable to extract text from the image. Please ensure the image is clear and contains readable text."
                    else:
                        error_msg = "Unable to process the image. Please check the image format and try again."

                    return Response(
                        {
                            "error": error_msg,
                            "show_default_message": True,
                            "detailed_error": str(e),
                        },
                        status=500,
                    )

            # Handle image regeneration requests
            if is_regenerate and message.startswith("regenerate:"):
                original_prompt = message[len("regenerate:") :].strip()
                image_result = self.generate_image(original_prompt)

                if image_result["success"]:
                    response_content = (
                        f"I've regenerated the image based on your request. Here it is:\n\n"
                        f"![Generated Image]({image_result['url']})\n\n"
                        f"*Revised prompt: {image_result['revised_prompt']}*"
                    )

                    # Store assistant response with regenerated image
                    assistant_message = ChatMessage.objects.create(
                        user=user,
                        role="assistant",
                        content=response_content,
                        image_url=image_result["url"],
                        is_image_generation=True,
                    )

                    return Response(
                        {
                            "response": response_content,
                            "image_url": image_result["url"],
                            "is_image": True,
                            "revised_prompt": image_result["revised_prompt"],
                        }
                    )
                else:
                    error_message = (
                        "I apologize, but I encountered an error while regenerating the image. "
                        "Would you like me to try again with a different approach?"
                    )

                    return Response(
                        {"response": error_message, "error": image_result["error"]}
                    )

            # Store user message
            user_message = ChatMessage.objects.create(
                user=user, role="user", content=message
            )

            # Check if this is an image generation request
            if self.is_image_request(message):
                image_result = self.generate_image(message)

                if image_result["success"]:
                    response_content = (
                        f"I've generated an image based on your request. Here it is:\n\n"
                        f"![Generated Image]({image_result['url']})\n\n"
                        f"*Revised prompt: {image_result['revised_prompt']}*"
                    )

                    # Store assistant response with image URL
                    assistant_message = ChatMessage.objects.create(
                        user=user,
                        role="assistant",
                        content=response_content,
                        image_url=image_result["url"],
                        is_image_generation=True,
                    )

                    return Response(
                        {
                            "response": response_content,
                            "image_url": image_result["url"],
                            "is_image": True,
                            "revised_prompt": image_result["revised_prompt"],
                        }
                    )
                else:
                    error_message = (
                        "I apologize, but I encountered an error while generating the image. "
                        "Would you like me to try again with a different approach, or can I help you with something else?"
                    )

                    # Store error response
                    assistant_message = ChatMessage.objects.create(
                        user=user,
                        role="assistant",
                        content=error_message,
                        is_error=True,
                        error_details=image_result["error"],
                    )

                    return Response(
                        {"response": error_message, "error": image_result["error"]}
                    )

            # Query database based on message content and user permissions
            query_params = {
                "name": None,
                "id": None,
                "doctor": None,
                "patient": None,
                "category": None,
                "specialization": None,
            }

            # Query database with user permissions
            data_context = {
                "patients": self.query_patients(query_params, user),
                "appointments": self.query_appointments(query_params, user),
                "medications": self.query_medications(query_params, user),
                "doctors": self.query_doctors(query_params, user),
            }

            # Prepare conversation history
            recent_messages = ChatMessage.objects.filter(
                user=user, timestamp__gte=timezone.now() - timedelta(hours=24)
            ).order_by("-timestamp")[:5]

            conversation_history = [
                {"role": msg.role, "content": msg.content}
                for msg in reversed(recent_messages)
            ]

            # Add role-specific context to the prompt
            role_context = {
                "manager": "You have full access to all clinic data.",
                "doctor": "You can access your own patients, appointments, and general medical data.",
                "secretary": "You have access to appointments and basic patient information.",
            }.get(role.lower(), "You have limited access to clinic data.")

            # Update the prompt with role-specific information
            prompt = (
                f"You are a professional AI Assistant with access to the clinic's database.\n"
                f"User name: {name}\n"
                f"User role: {role}\n"
                f"Access level: {role_context}\n"
                f"Database Information:\n"
                f"{json.dumps(data_context, indent=2)}\n\n"
                f"Previous conversation context:\n"
                f"{json.dumps(conversation_history, indent=2)}\n\n"
                f"Current user message: {message}\n\n"
                f"Guidelines:\n"
                f"- You have role-based access to the following data types: patients, appointments, medications, and doctors\n"
                f"- Only show data that the user has permission to access\n"
                f"- Format the data in a clear, readable way using markdown\n"
                f"- If data is not available due to permissions, explain why\n"
                f"- Keep responses professional and relevant to clinical topics\n"
                f"- You can use tables and lists to organize data\n"
                f"- Maintain patient confidentiality and data access restrictions"
            )

            try:
                response = client.chat.completions.create(
                    model=CHAT_MODEL,  # Using the configured model
                    messages=[{"role": "user", "content": prompt}],
                    max_tokens=800,
                    temperature=0.7,
                )

                answer = response.choices[0].message.content.strip()

                # Store assistant response
                assistant_message = ChatMessage.objects.create(
                    user=user, role="assistant", content=answer
                )

                return Response({"response": answer})

            except Exception as e:
                return Response(
                    {"error": f"Failed to process your request: {str(e)}"}, status=500
                )

        except Exception as e:
            return Response(
                {"error": "An error occurred while processing your request"}, status=500
            )
