from django.urls import path
from .views import ChatAPIView, DatabaseTestView

urlpatterns = [
    path("", ChatAPIView.as_view(), name="chat-api"),
    path('test-db/', DatabaseTestView.as_view(), name='test-db'),
]
