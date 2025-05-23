# Generated by Django 5.2 on 2025-04-22 01:46

import creditcards.models
import django.core.validators
import phonenumber_field.modelfields
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='EmergencyContact',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(max_length=100, verbose_name='first name')),
                ('last_name', models.CharField(max_length=100, verbose_name='last name')),
                ('relationship', models.CharField(max_length=50, verbose_name='relationship')),
                ('phone_number', phonenumber_field.modelfields.PhoneNumberField(blank=True, max_length=128, null=True, region=None, verbose_name='phone number')),
                ('is_active', models.BooleanField(default=True, verbose_name='is active')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='created at')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='updated at')),
            ],
        ),
        migrations.CreateModel(
            name='Patient',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('patient_id', models.UUIDField(default=uuid.uuid4, editable=False, unique=True, verbose_name='patient ID')),
                ('first_name', models.CharField(max_length=100, verbose_name='first name')),
                ('last_name', models.CharField(max_length=100, verbose_name='last name')),
                ('birth_date', models.DateField(verbose_name='birth date')),
                ('gender', models.CharField(choices=[('male', 'Male'), ('female', 'Female'), ('other', 'Other')], max_length=10, verbose_name='gender')),
                ('email', models.EmailField(blank=True, max_length=254, null=True, unique=True, verbose_name='email address')),
                ('phone_number', phonenumber_field.modelfields.PhoneNumberField(blank=True, max_length=128, null=True, region=None, verbose_name='phone number')),
                ('address', models.CharField(blank=True, max_length=255, null=True, verbose_name='address')),
                ('city', models.CharField(blank=True, max_length=100, null=True, verbose_name='city')),
                ('blood_type', models.CharField(blank=True, choices=[('A+', 'A+'), ('A-', 'A-'), ('B+', 'B+'), ('B-', 'B-'), ('AB+', 'AB+'), ('AB-', 'AB-'), ('O+', 'O+'), ('O-', 'O-'), ('unknown', 'Unknown')], default='unknown', max_length=7, null=True, verbose_name='blood type')),
                ('credit_card_number', creditcards.models.CardNumberField(blank=True, max_length=25, null=True, verbose_name='credit card number')),
                ('height', models.DecimalField(blank=True, decimal_places=2, max_digits=5, null=True, validators=[django.core.validators.MinValueValidator(0)], verbose_name='height (cm)')),
                ('weight', models.DecimalField(blank=True, decimal_places=2, max_digits=6, null=True, validators=[django.core.validators.MinValueValidator(0)], verbose_name='weight (kg)')),
                ('insurance_provider', models.CharField(blank=True, max_length=255, null=True, verbose_name='insurance provider')),
                ('insurance_number', models.CharField(blank=True, max_length=255, null=True, verbose_name='insurance number')),
                ('insurance_expiration_date', models.DateField(blank=True, null=True, verbose_name='insurance expiration date')),
                ('is_active', models.BooleanField(default=True, verbose_name='is active')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='created at')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='updated at')),
            ],
        ),
    ]
