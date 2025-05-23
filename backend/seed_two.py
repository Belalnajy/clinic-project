import os
import random
from datetime import timedelta
from django.utils import timezone
import django

# Django setup
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

# Import models
from users.models import User
from doctors.models import Doctor, Specialization
from patients.models import Patient
from appointments.models import Appointment
from billing.models import Payment
from medical_records.models import (
    MedicalRecord,
    LabResult,
    Prescription,
    PrescriptionMedication,
)
from medications.models import Medication


def clean_database():
    """Remove all data from tables"""
    print("Cleaning database...")
    PrescriptionMedication.objects.all().delete()
    Prescription.objects.all().delete()
    LabResult.objects.all().delete()
    MedicalRecord.objects.all().delete()
    Payment.objects.all().delete()
    Appointment.objects.all().delete()
    Patient.objects.all().delete()
    Doctor.objects.all().delete()
    Specialization.objects.all().delete()
    User.objects.exclude(is_superuser=True).delete()
    Medication.objects.all().delete()
    print("Database cleaned.")


def seed_database():
    """Seed database with sample data"""
    print("Seeding database...")

    # Get or create admin user
    admin, created = User.objects.get_or_create(
        email="admin@example.com",
        defaults={
            "password": "password123",
            "role": "admin",
            "first_name": "Admin",
            "last_name": "One",
            "is_staff": True,
            "is_active": True,
            "is_superuser": True,
            "date_joined": timezone.now(),
            "status": "available",
        },
    )
    if created:
        admin.set_password("password123")
        admin.save()
        print("Created admin user")
    else:
        print("Using existing admin user")

    # Predefined data
    cities = [
        "Cairo",
        "Alexandria",
        "Giza",
        "Luxor",
        "Aswan",
        "Mansoura",
        "Tanta",
        "Asyut",
        "Ismailia",
        "Faiyum",
        "Zagazig",
        "Damietta",
        "Minya",
        "Beni Suef",
        "Sohag",
        "Hurghada",
        "6th of October",
        "Shibin El Kom",
    ]
    first_names = [
        "Ahmed",
        "Mohamed",
        "Fatma",
        "Aisha",
        "Khaled",
        "Sara",
        "Hassan",
        "Nour",
        "Youssef",
        "Amira",
        "Omar",
        "Laila",
        "Mahmoud",
        "Rania",
        "Ali",
        "Hoda",
    ]
    last_names = [
        "Mostafa",
        "Ibrahim",
        "Hassan",
        "Khalil",
        "Sayed",
        "Farouk",
        "Nasser",
        "Mahmoud",
        "Youssef",
        "Abdel",
        "Salem",
        "Ezz",
        "Omar",
        "Fathy",
    ]
    specializations_list = [
        "Cardiology",
        "Neurology",
        "Pediatrics",
        "Orthopedics",
        "Dermatology",
        "Ophthalmology",
        "General Surgery",
        "Internal Medicine",
        "Psychiatry",
        "Radiology",
    ]
    blood_types = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]
    medications_list = [
        "Paracetamol",
        "Ibuprofen",
        "Amoxicillin",
        "Metformin",
        "Atorvastatin",
        "Omeprazole",
        "Losartan",
        "Amlodipine",
        "Levothyroxine",
        "Salbutamol",
    ]
    diagnosis_list = [
        "Hypertension",
        "Diabetes",
        "Common Cold",
        "Asthma",
        "Arthritis",
        "Migraine",
        "Infection",
        "Allergy",
        "Gastritis",
        "Anemia",
    ]

    # Create specializations
    print("Creating specializations...")
    specializations = []
    for name in specializations_list:
        specializations.append(
            Specialization.objects.create(
                name=name, description=f"Specialization in {name}", is_active=True
            )
        )

    # Create managers and doctors
    print("Creating managers and doctors...")
    managers = []
    doctors = []
    for i in range(10):  # Create 10 managers
        user = User.objects.create_user(
            email=f"manager{i+1}@example.com",
            password="password123",
            role="manager",
            first_name=random.choice(first_names),
            last_name=random.choice(last_names),
            is_active=True,
            date_joined=timezone.now(),
            status="available",
        )
        managers.append(user)

        # Create a doctor instance for each manager
        doctors.append(
            Doctor.objects.create(
                user=user,
                specialization=random.choice(specializations),
                license_number=f"LC{random.randint(10000, 99999)}",
                years_of_experience=random.randint(1, 20),
                qualifications=f"MD in {random.choice(specializations_list)}",
                bio=f"Experienced {random.choice(specializations_list)} specialist",
            )
        )

    # Create additional doctors
    print("Creating additional doctors...")
    for i in range(20):  # Create 20 additional doctors
        user = User.objects.create_user(
            email=f"doctor{i+1}@example.com",
            password="password123",
            role="doctor",
            first_name=random.choice(first_names),
            last_name=random.choice(last_names),
            is_active=True,
            date_joined=timezone.now(),
            status="available",
        )
        doctors.append(
            Doctor.objects.create(
                user=user,
                specialization=random.choice(specializations),
                license_number=f"LC{random.randint(10000, 99999)}",
                years_of_experience=random.randint(1, 20),
                qualifications=f"MD in {random.choice(specializations_list)}",
                bio=f"Experienced {random.choice(specializations_list)} specialist",
            )
        )

    # Create patients
    print("Creating patients...")
    patients = []
    for i in range(100):  # Create 100 patients
        first_name = random.choice(first_names)
        last_name = random.choice(last_names)
        patients.append(
            Patient.objects.create(
                first_name=first_name,
                last_name=last_name,
                birth_date=timezone.now().date()
                - timedelta(days=random.randint(365 * 18, 365 * 80)),
                gender=random.choice(["male", "female"]),  # Only male or female
                email=f"patient{i+1}@example.com",
                phone_number=f"+201{random.randint(100000000, 999999999)}",
                address=f"{random.randint(1, 100)} {random.choice(['St', 'Ave'])}, {random.choice(cities)}",
                city=random.choice(cities),
                blood_type=random.choice(blood_types),
                credit_card_number=f"4{random.randint(100000000000, 999999999999)}",
                height=random.uniform(150, 200),
                weight=random.uniform(40, 120),
                insurance_provider=f"Insurance Co. {random.randint(1, 10)}",
                insurance_number=f"INS{random.randint(1000, 9999)}",
                insurance_expiration_date=timezone.now().date()
                + timedelta(days=random.randint(30, 365 * 5)),
                created_by=admin,  # Use admin as the creator
            )
        )

    # Create appointments
    print("Creating appointments...")
    appointments = []
    today = timezone.now().date()
    
    # Define time slots and statuses
    time_slots = [
        f"{hour:02d}:{minute:02d}:00" 
        for hour in range(9, 17) 
        for minute in [00, 30]
    ]
    
    # Create today's appointments for each doctor
    for doctor in doctors:
        # Create appointments with different statuses for today
        
        # 2-3 completed appointments (morning slots)
        morning_slots = time_slots[:6]  # First 3 hours
        for _ in range(random.randint(2, 3)):
            if not morning_slots:
                break
            slot = random.choice(morning_slots)
            morning_slots.remove(slot)
            
            appointment = Appointment.objects.create(
                patient=random.choice(patients),
                doctor=doctor,
                appointment_date=today,
                appointment_time=slot,
                duration=30,
                status='completed',
                notes=f"Completed appointment with Dr. {doctor.user.last_name}",
                created_by=admin
            )
            appointments.append(appointment)
        
        # 2-3 in_queue appointments (current time slots)
        mid_slots = time_slots[6:12]  # Middle hours
        for _ in range(random.randint(2, 3)):
            if not mid_slots:
                break
            slot = random.choice(mid_slots)
            mid_slots.remove(slot)
            
            appointment = Appointment.objects.create(
                patient=random.choice(patients),
                doctor=doctor,
                appointment_date=today,
                appointment_time=slot,
                duration=30,
                status='in_queue',
                notes=f"Waiting for Dr. {doctor.user.last_name}",
                created_by=admin
            )
            appointments.append(appointment)
        
        # 2-3 scheduled appointments (afternoon slots)
        afternoon_slots = time_slots[12:]  # Remaining hours
        for _ in range(random.randint(2, 3)):
            if not afternoon_slots:
                break
            slot = random.choice(afternoon_slots)
            afternoon_slots.remove(slot)
            
            appointment = Appointment.objects.create(
                patient=random.choice(patients),
                doctor=doctor,
                appointment_date=today,
                appointment_time=slot,
                duration=30,
                status='scheduled',
                notes=f"Scheduled with Dr. {doctor.user.last_name}",
                created_by=admin
            )
            appointments.append(appointment)

    # Create payments
    print("Creating payments...")
    payments = []
    for appointment in appointments:
        payments.append(
            Payment.objects.create(
                patient=appointment.patient,
                appointment=appointment,
                amount=random.uniform(50, 500),
                method=random.choice(
                    ["Credit Card", "Debit Card", "Cash", "Insurance"]
                ),
                status=random.choice(["Paid", "Pending", "Failed"]),
            )
        )

    # Create medical records, lab results, prescriptions, and medications
    print("Creating medical records and related data...")
    medical_records = []
    for appointment in appointments:
        medical_record = MedicalRecord.objects.create(
            patient=appointment.patient,
            doctor=appointment.doctor,
            appointment=appointment,
            diagnosis=random.choice(diagnosis_list),
            description=f"Diagnosis of {random.choice(diagnosis_list)}",
            notes=f"Treatment plan for {random.choice(diagnosis_list)}",
        )
        medical_records.append(medical_record)

        # Create lab result with medical record
        LabResult.objects.create(
            patient=appointment.patient,
            medical_record=medical_record,
            test_name=f"{random.choice(['Blood', 'Urine', 'X-Ray', 'MRI'])} Test",
            test_date=timezone.now().date() - timedelta(days=random.randint(1, 30)),
            results=f"Results for {random.choice(diagnosis_list)} test",
        )

        # Create prescription
        prescription = Prescription.objects.create(medical_record=medical_record)

        # Create medication
        medication = Medication.objects.create(
            name=random.choice(medications_list),
            default_dosage=f"{random.randint(1, 500)}mg",
            description=f"Medication for {random.choice(diagnosis_list)}",
        )

        # Create prescription medication
        PrescriptionMedication.objects.create(
            prescription=prescription,
            medication=medication,
            dosage=f"{random.randint(1, 2)} {random.choice(['tablet', 'capsule'])}",
            frequency=f"{random.choice(['Once', 'Twice'])} daily",
            duration=f"{random.randint(5, 30)} days",
            instructions=f"Take with {random.choice(['food', 'water'])}",
        )

    print("\nDatabase seeded successfully!")
    print("Created records:")
    print(f"Users: {User.objects.count()}")
    print(f"Specializations: {Specialization.objects.count()}")
    print(f"Doctors: {Doctor.objects.count()}")
    print(f"Patients: {Patient.objects.count()}")
    print(f"Appointments: {Appointment.objects.count()}")
    print(f"Payments: {Payment.objects.count()}")
    print(f"Medical Records: {MedicalRecord.objects.count()}")
    print(f"Lab Results: {LabResult.objects.count()}")
    print(f"Prescriptions: {Prescription.objects.count()}")
    print(f"Medications: {Medication.objects.count()}")
    print(f"Prescription Medications: {PrescriptionMedication.objects.count()}")


if __name__ == "__main__":
    clean_database()
    seed_database()