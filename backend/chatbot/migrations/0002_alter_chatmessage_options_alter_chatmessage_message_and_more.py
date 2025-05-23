# Generated by Django 5.2 on 2025-04-25 23:24

import django.utils.timezone
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chatbot', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='chatmessage',
            options={'ordering': ['timestamp']},
        ),
        migrations.AlterField(
            model_name='chatmessage',
            name='message',
            field=models.TextField(db_column='message'),
        ),
        migrations.RenameField(
            model_name='chatmessage',
            old_name='message',
            new_name='content',
        ),
        migrations.RemoveField(
            model_name='chatmessage',
            name='created_at',
        ),
        migrations.RemoveField(
            model_name='chatmessage',
            name='response',
        ),
        migrations.AddField(
            model_name='chatmessage',
            name='embedding',
            field=models.JSONField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='chatmessage',
            name='role',
            field=models.CharField(default='user', max_length=10),
        ),
        migrations.AddField(
            model_name='chatmessage',
            name='timestamp',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
        migrations.AddIndex(
            model_name='chatmessage',
            index=models.Index(fields=['user', 'timestamp'], name='chatbot_cha_user_id_ac2c89_idx'),
        ),
    ]
