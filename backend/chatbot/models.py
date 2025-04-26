from django.db import models
from django.conf import settings
from django.utils import timezone

# Create your models here.

class ChatSession(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='chat_sessions'
    )
    title = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    model_used = models.CharField(max_length=50, default='gpt-4o-mini')
    context_window = models.IntegerField(default=4096)
    temperature = models.FloatField(default=0.7)
    system_prompt = models.TextField(blank=True)
    metadata = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ['-updated_at']
        indexes = [
            models.Index(fields=['user', 'is_active']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f"{self.user.username} - {self.title or 'Untitled'} - {self.created_at}"

class ChatMessage(models.Model):
    session = models.ForeignKey(
        ChatSession,
        on_delete=models.CASCADE,
        related_name='messages',
        null=True,
        blank=True
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='chat_messages'
    )
    role = models.CharField(max_length=10, default='user')  # 'user' or 'assistant'
    content = models.TextField()
    timestamp = models.DateTimeField(default=timezone.now)
    embedding = models.JSONField(null=True, blank=True)  # For semantic search
    tokens = models.IntegerField(null=True, blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    is_error = models.BooleanField(default=False)
    error_details = models.TextField(blank=True)
    parent_message = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='replies'
    )
    image_url = models.URLField(max_length=1000, blank=True, null=True)  # Store generated image URLs
    is_image_generation = models.BooleanField(default=False)  # Flag for image generation messages
    uploaded_image = models.ImageField(upload_to='chat_images/', null=True, blank=True)  # For user uploaded images
    has_image = models.BooleanField(default=False)  # Flag to indicate if message has an image

    class Meta:
        ordering = ['timestamp']
        indexes = [
            models.Index(fields=['user', 'timestamp']),
            models.Index(fields=['session', 'timestamp']),
            models.Index(fields=['embedding']),
        ]

    def __str__(self):
        return f"{self.user.username} - {self.role} - {self.timestamp}"

    def save(self, *args, **kwargs):
        if not self.session and self.user:
            # Create a new session if none exists
            self.session = ChatSession.objects.create(
                user=self.user,
                title=f"Chat {timezone.now().strftime('%Y-%m-%d %H:%M')}"
            )
        # Set has_image flag
        self.has_image = bool(self.uploaded_image or self.image_url)
        super().save(*args, **kwargs)
