from django.core.management.base import BaseCommand
from doctors.models import Specialization

class Command(BaseCommand):
    help = 'Creates initial specializations'

    def handle(self, *args, **kwargs):
        specializations = [
            {
                'name': 'General Practice',
                'description': 'Provides primary healthcare and treats a wide range of conditions'
            },
            {
                'name': 'Cardiology',
                'description': 'Specializes in diagnosing and treating heart conditions'
            },
            {
                'name': 'Dermatology',
                'description': 'Focuses on conditions affecting the skin, hair, and nails'
            },
            {
                'name': 'Pediatrics',
                'description': 'Specializes in the care of infants, children, and adolescents'
            },
            {
                'name': 'Orthopedics',
                'description': 'Deals with conditions affecting bones, joints, and muscles'
            },
            {
                'name': 'Neurology',
                'description': 'Focuses on disorders of the nervous system'
            },
            {
                'name': 'Psychiatry',
                'description': 'Specializes in mental health and behavioral disorders'
            },
            {
                'name': 'Ophthalmology',
                'description': 'Deals with eye disorders and vision care'
            },
            {
                'name': 'ENT',
                'description': 'Specializes in ear, nose, and throat conditions'
            },
            {
                'name': 'Gynecology',
                'description': 'Focuses on women\'s reproductive health'
            }
        ]

        for spec_data in specializations:
            Specialization.objects.get_or_create(
                name=spec_data['name'],
                defaults={'description': spec_data['description']}
            )

        self.stdout.write(self.style.SUCCESS('Successfully created specializations')) 