from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .utils import get_recent_data_by_role
import openai
import os

client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class ChatAPIView(APIView):
    permission_classes = [IsAuthenticated]  
    def post(self, request):
        role = getattr(request.user, "role", "user") 
        message = request.data.get("message")

        if not message:
            return Response({"error": "Message is required."}, status=400)
        context_data = get_recent_data_by_role(role)
        prompt = f"""
        You are a smart and helpful Clinic Assistant AI.
        Your current user is a "{role}".
        Use ONLY the following relevant recent clinic data:
        {context_data}

        Now respond to this message:
        "{message}"
        """

        try:
            response = client.chat.completions.create(
                model="gpt-4o-mini", 
                messages=[{"role": "user", "content": prompt}],
                max_tokens=400,
                temperature=0.7,
            )
            ai_reply = response.choices[0].message.content.strip()

            return Response({"response": ai_reply})

        except Exception as e:
            return Response({"error": str(e)}, status=500)
