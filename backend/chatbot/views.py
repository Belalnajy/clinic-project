from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .utils import get_recent_data_by_role
import openai
import os
import logging
from django.utils import timezone
from django.conf import settings

logger = logging.getLogger(__name__)

class ChatAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        role = getattr(user, "role", "user")
        name = getattr(user, "first_name", "") or getattr(user, "username", "User")
        message = request.data.get("message", "").strip()

        if not message:
            return Response({"error": "Message is required."}, status=400)

        try:
            context_data = get_recent_data_by_role(role, user)
            
            prompt = (
                f"You are a smart Clinic Assistant AI. Current date: {timezone.now().date()}\n"
                f"User: {name} (Role: {role})\n"
                f"Clinic data context:\n{context_data}\n\n"
                f"User question: {message}\n\n"
                f"Guidelines:\n"
                f"- Be professional and helpful\n"
                f"- Use only the provided data\n"
                f"- For medical advice, suggest consulting a doctor\n"
                f"- Keep responses concise but complete"
            )

            client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
            response = client.chat.completions.create(
                model="gpt-4o-mini", 
                messages=[{"role": "user", "content": prompt}],
                max_tokens=400,
                temperature=0.7,
            )
            if response.choices and response.choices[0].message:
                ai_reply = response.choices[0].message.content.strip()
                return Response({"response": ai_reply})
            
            return Response({"error": "No response from AI"}, status=500)

        except Exception as e:
            logger.error(f"Chat error: {str(e)}", exc_info=True)
            return Response(
                {"error": "Unable to process your request. Please try again."},
                status=500
            )