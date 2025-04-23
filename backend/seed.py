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
from patients.models import Patient, EmergencyContact
from appointments.models import Appointment
from billing.models import Payment
from medical_records.models import MedicalRecord, LabResult, Prescription, PrescriptionMedication
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
    EmergencyContact.objects.all().delete()
    Patient.objects.all().delete()
    Doctor.objects.all().delete()
    Specialization.objects.all().delete()
    User.objects.exclude(is_superuser=True).delete()
    Medication.objects.all().delete()
    print("Database cleaned.")

def seed_database():
    """Seed database with sample data"""
    print("Seeding database...")

    # Predefined data
    cities = [
        "Cairo", "Alexandria", "Giza", "Luxor", "Aswan", "Mansoura", "Tanta",
        "Asyut", "Ismailia", "Faiyum", "Zagazig", "Damietta", "Minya", "Beni Suef",
        "Sohag", "Hurghada", "6th of October", "Shibin El Kom"
    ]
    first_names = [
        "Ahmed", "Mohamed", "Fatma", "Aisha", "Khaled", "Sara", "Hassan", "Nour",
        "Youssef", "Amira", "Omar", "Laila", "Mahmoud", "Rania", "Ali", "Hoda"
    ]
    last_names = [
        "Mostafa", "Ibrahim", "Hassan", "Khalil", "Sayed", "Farouk", "Nasser",
        "Mahmoud", "Youssef", "Abdel", "Salem", "Ezz", "Omar", "Fathy"
    ]
    specializations_list = [
        "Cardiology", "Neurology", "Pediatrics", "Orthopedics", "Dermatology",
        "Ophthalmology", "General Surgery", "Internal Medicine", "Psychiatry",
        "Radiology"
    ]
    blood_types = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]
    medications_list = [
        "Paracetamol", "Ibuprofen", "Amoxicillin", "Metformin", "Atorvastatin",
        "Omeprazole", "Losartan", "Amlodipine", "Levothyroxine", "Salbutamol"
    ]
    diagnosis_list = [
        "Hypertension", "Diabetes", "Common Cold", "Asthma", "Arthritis",
        "Migraine", "Infection", "Allergy", "Gastritis", "Anemia"
    ]

    # Create admin user with superuser privileges
    admin = User.objects.create_user(
        email="admin@example.com",
        password="password123",
        role="admin",
        first_name="Admin",
        last_name="One",
        is_staff=True,
        is_active=True,
        is_superuser=True,  # Added to grant full admin access
        date_joined=timezone.now(),
        status="available"
    )

    # Create specializations
    print("Creating specializations...")
    specializations = []
    for name in specializations_list:
        specializations.append(
            Specialization.objects.create(
                name=name,
                description=f"Specialization in {name}",
                is_active=True
            )
        )

    # Create doctors
    print("Creating doctors...")
    doctors = []
    for i in range(20):
        user = User.objects.create_user(
            email=f"doctor{i+1}@example.com",
            password="password123",
            role="doctor",
            first_name=random.choice(first_names),
            last_name=random.choice(last_names),
            is_active=True,
            date_joined=timezone.now(),
            status="available"
        )
        doctors.append(
            Doctor.objects.create(
                user=user,
                specialization=random.choice(specializations),
                license_number=f"LC{random.randint(10000, 99999)}",
                years_of_experience=random.randint(1, 20),
                qualifications=f"MD in {random.choice(specializations_list)}",
                bio=f"Experienced {random.choice(specializations_list)} specialist"
            )
        )

    # Create patients (without User accounts)
    print("Creating patients...")
    patients = []
    for i in range(100):
        first_name = random.choice(first_names)
        last_name = random.choice(last_names)
        patients.append(
            Patient.objects.create(
                first_name=first_name,
                last_name=last_name,
                birth_date=timezone.now().date() - timedelta(days=random.randint(365*18, 365*80)),
                gender=random.choice(['male', 'female', 'other']),
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
                insurance_expiration_date=timezone.now().date() + timedelta(days=random.randint(30, 365*5)),
                created_by=admin  # Use admin as the creator
            )
        )

    # Create emergency contacts
    print("Creating emergency contacts...")
    for patient in patients:
        EmergencyContact.objects.create(
            patient=patient,
            first_name=random.choice(first_names),
            last_name=random.choice(last_names),
            relationship=random.choice(["Parent", "Spouse", "Friend"]),
            phone_number=f"+201{random.randint(100000000, 999999999)}"
        )

    # Create appointments
    print("Creating appointments...")
    appointments = []
    today = timezone.now().date()
    for i in range(100):
        appointments.append(
            Appointment.objects.create(
                patient=random.choice(patients),
                doctor=random.choice(doctors),
                appointment_date=today - timedelta(days=random.randint(1, 30)),
                appointment_time=f"{random.randint(8, 17)}:{random.choice(['00', '30'])}:00",
                duration=30,
                status="scheduled",
                notes=f"Appointment for {random.choice(diagnosis_list)} consultation",
                created_by=admin
            )
        )

    # Create payments
    print("Creating payments...")
    payments = []
    for appointment in appointments:
        payments.append(
            Payment.objects.create(
                patient=appointment.patient,
                appointment=appointment,
                amount=random.uniform(50, 500),
                method=random.choice(['Credit Card', 'Debit Card', 'Cash', 'Insurance']),
                status=random.choice(['Paid', 'Pending', 'Failed'])
            )
        )

    # Create medical records, lab results, prescriptions, and medications
    print("Creating medical records and related data...")
    medical_records = []
    for appointment in appointments:
        medical_record = MedicalRecord.objects.create(
            patient=appointment.patient,
            doctor=appointment.doctor,  # Fixed typo
            appointment=appointment,
            diagnosis=random.choice(diagnosis_list),
            description=f"Diagnosis of {random.choice(diagnosis_list)}",
            notes=f"Treatment plan for {random.choice(diagnosis_list)}"
        )
        medical_records.append(medical_record)

        # Create lab result
        LabResult.objects.create(
            medical_record=medical_record,
            test_name=f"{random.choice(['Blood', 'Urine', 'X-Ray', 'MRI'])} Test",
            test_date=today - timedelta(days=random.randint(1, 30)),
            results=f"Results for {random.choice(diagnosis_list)} test"
        )

        # Create prescription
        prescription = Prescription.objects.create(
            medical_record=medical_record
        )

        # Create medication
        medication = Medication.objects.create(
            name=random.choice(medications_list),
            default_dosage=f"{random.randint(1, 500)}mg",
            description=f"Medication for {random.choice(diagnosis_list)}"
        )

        # Create prescription medication
        PrescriptionMedication.objects.create(
            prescription=prescription,
            medication=medication,
            dosage=f"{random.randint(1, 2)} {random.choice(['tablet', 'capsule'])}",
            frequency=f"{random.choice(['Once', 'Twice'])} daily",
            duration=f"{random.randint(5, 30)} days",
            instructions=f"Take with {random.choice(['food', 'water'])}"
        )

    print("\nDatabase seeded successfully!")
    print("Created records:")
    print(f"Users: {User.objects.count()}")
    print(f"Specializations: {Specialization.objects.count()}")
    print(f"Doctors: {Doctor.objects.count()}")
    print(f"Patients: {Patient.objects.count()}")
    print(f"Emergency Contacts: {EmergencyContact.objects.count()}")
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