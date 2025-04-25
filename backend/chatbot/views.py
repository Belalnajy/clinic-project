import os
from openai import OpenAI
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly

client = OpenAI(api_key=os.getenv("OPENAI_KEY"))


class ChatAPIView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def post(self, request):
        message = request.data.get("message", "").strip()
        if not message:
            return Response({"error": "Message is required."}, status=400)

        user = request.user
        name = user.first_name or user.username or "User"
        role = user.role or "Unknown Role"
        
        prompt = (
            f"You are a professional AI Assistant specialized in clinical topics.\n"
            f"User name: {name}\n"
            f"User role: {role}\n"
            f"User message: {message}\n\n"
            f"Guidelines:\n"
            f"- Respond only to clinical, medical, or clinic-related administrative topics.\n"
            f"- If asked something outside the clinical domain, politely respond that you are only specialized in clinical topics.\n"
            f"- Keep responses concise and relevant to clinical topics."
        )

        try:
            response = client.chat.completions.create(
                model="gpt-4o-mini",  
                messages=[{"role": "user", "content": prompt}],
                max_tokens=400,
                temperature=0.7,
            )

            answer = response.choices[0].message.content.strip()
            return Response({"response": answer})

        except Exception as e:
            return Response({"error": str(e)}, status=500)
