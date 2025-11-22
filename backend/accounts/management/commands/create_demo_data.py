from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
from requests.models import PurchaseRequest, Approval, RequestItem
from decimal import Decimal
import random

User = get_user_model()


class Command(BaseCommand):
    help = 'Create demo data for the Procure-to-Pay system'

    def handle(self, *args, **options):
        self.stdout.write('Creating demo data...')

        # Get existing users
        try:
            staff_user = User.objects.get(username='staff1')
            approver1 = User.objects.get(username='approver1')
            approver2 = User.objects.get(username='approver2')
            finance_user = User.objects.get(username='finance1')
        except User.DoesNotExist:
            self.stdout.write(self.style.ERROR('Test users not found. Run create_test_users first.'))
            return

        # Sample vendors and items
        vendors = [
            'TechCorp Solutions', 'Office Supplies Inc', 'Global Electronics',
            'Business Services Ltd', 'Digital Solutions', 'Professional Services'
        ]

        items_data = [
            {'name': 'Laptop Computer', 'price': Decimal('1200.00')},
            {'name': 'Office Chair', 'price': Decimal('250.00')},
            {'name': 'Printer Paper (500 sheets)', 'price': Decimal('45.00')},
            {'name': 'Software License', 'price': Decimal('299.99')},
            {'name': 'Projector', 'price': Decimal('800.00')},
            {'name': 'Conference Table', 'price': Decimal('1500.00')},
            {'name': 'Whiteboard', 'price': Decimal('120.00')},
            {'name': 'Coffee Machine', 'price': Decimal('350.00')},
            {'name': 'External Hard Drive', 'price': Decimal('89.99')},
            {'name': 'Wireless Router', 'price': Decimal('75.00')},
        ]

        # Create demo purchase requests with different statuses
        demo_requests = [
            {
                'title': 'Office Equipment Purchase',
                'description': 'New laptops and office chairs for the development team',
                'amount': Decimal('2900.00'),
                'status': 'approved',
                'items': [items_data[0], items_data[1]],  # Laptop + Chair
                'vendor': vendors[0]
            },
            {
                'title': 'Software Licenses',
                'description': 'Annual software licenses for design tools',
                'amount': Decimal('899.97'),
                'status': 'approved',
                'items': [items_data[3], items_data[3], items_data[3]],  # 3 Software licenses
                'vendor': vendors[4]
            },
            {
                'title': 'Conference Room Setup',
                'description': 'Equipment for the new conference room',
                'amount': Decimal('2420.00'),
                'status': 'pending',
                'items': [items_data[4], items_data[5], items_data[6]],  # Projector + Table + Whiteboard
                'vendor': vendors[1]
            },
            {
                'title': 'IT Infrastructure',
                'description': 'Network equipment and storage devices',
                'amount': Decimal('164.99'),
                'status': 'approved',
                'items': [items_data[8], items_data[9]],  # Hard drive + Router
                'vendor': vendors[2]
            },
            {
                'title': 'Office Supplies',
                'description': 'Monthly office supplies and coffee machine',
                'amount': Decimal('395.00'),
                'status': 'rejected',
                'items': [items_data[2], items_data[7]],  # Paper + Coffee machine
                'vendor': vendors[1]
            },
            {
                'title': 'Consulting Services',
                'description': 'External consulting for system optimization',
                'amount': Decimal('2500.00'),
                'status': 'pending',
                'items': [{'name': 'Consulting Services (per day)', 'price': Decimal('500.00'), 'quantity': 5}],
                'vendor': vendors[5]
            }
        ]

        created_requests = []

        for req_data in demo_requests:
            # Create purchase request
            request = PurchaseRequest.objects.create(
                title=req_data['title'],
                description=req_data['description'],
                amount=req_data['amount'],
                status=req_data['status'],
                created_by=staff_user,
                created_at=timezone.now() - timezone.timedelta(days=random.randint(1, 30))
            )

            # Create request items
            for item_data in req_data['items']:
                quantity = item_data.get('quantity', 1)
                RequestItem.objects.create(
                    purchase_request=request,
                    item_name=item_data['name'],
                    price=item_data['price'],
                    quantity=quantity
                )

            # Create approvals based on status
            if req_data['status'] in ['approved', 'rejected']:
                # Level 1 approval
                Approval.objects.create(
                    purchase_request=request,
                    approver=approver1,
                    level=1,
                    status='approved' if req_data['status'] != 'rejected' else 'rejected',
                    comments='Approved for procurement' if req_data['status'] != 'rejected' else 'Budget constraints',
                    timestamp=request.created_at + timezone.timedelta(hours=2)
                )

                if req_data['status'] == 'approved':
                    # Level 2 approval
                    Approval.objects.create(
                        purchase_request=request,
                        approver=approver2,
                        level=2,
                        status='approved',
                        comments='Final approval granted',
                        timestamp=request.created_at + timezone.timedelta(hours=4)
                    )

                    # Add approved_by users
                    request.approved_by.add(approver1, approver2)

            created_requests.append(request)
            self.stdout.write(f'Created request: {request.title} ({request.status})')

        self.stdout.write(self.style.SUCCESS(f'Successfully created {len(created_requests)} demo purchase requests with items and approvals!'))

        # Summary
        total_requests = PurchaseRequest.objects.count()
        approved_requests = PurchaseRequest.objects.filter(status='approved').count()
        pending_requests = PurchaseRequest.objects.filter(status='pending').count()
        rejected_requests = PurchaseRequest.objects.filter(status='rejected').count()

        self.stdout.write('\n' + '='*50)
        self.stdout.write('DEMO DATA SUMMARY:')
        self.stdout.write('='*50)
        self.stdout.write(f'Total Requests: {total_requests}')
        self.stdout.write(f'Approved: {approved_requests}')
        self.stdout.write(f'Pending: {pending_requests}')
        self.stdout.write(f'Rejected: {rejected_requests}')
        self.stdout.write('='*50)