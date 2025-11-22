from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import transaction


class PurchaseRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='created_requests'
    )
    approved_by = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='approved_requests',
        blank=True
    )
    proforma_file = models.FileField(
        upload_to='proformas/',
        blank=True,
        null=True
    )
    receipt_file = models.FileField(
        upload_to='receipts/',
        blank=True,
        null=True
    )
    purchase_order_file = models.FileField(
        upload_to='purchase_orders/',
        blank=True,
        null=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} - {self.status}"

    def can_edit(self):
        """Check if request can be edited (only pending status)"""
        return self.status == 'pending'

    def can_approve(self, user):
        """Check if user can approve this request"""
        if self.status != 'pending':
            return False

        approvals = self.approvals.all()
        approved_levels = set(approval.level for approval in approvals.filter(status='approved'))

        if user.role == 'approver_1' and 1 not in approved_levels:
            return True
        elif user.role == 'approver_2' and 1 in approved_levels and 2 not in approved_levels:
            return True

        return False

    def approve(self, user, comments=''):
        """Approve the request"""
        with transaction.atomic():
            level = 1 if user.role == 'approver_1' else 2
            Approval.objects.create(
                purchase_request=self,
                approver=user,
                level=level,
                status='approved',
                comments=comments
            )

            # Check if fully approved
            approvals = self.approvals.all()
            if approvals.filter(level=1, status='approved').exists() and \
               approvals.filter(level=2, status='approved').exists():
                self.status = 'approved'
                self.save()
                # TODO: Generate PO

    def reject(self, user, comments=''):
        """Reject the request"""
        with transaction.atomic():
            level = 1 if user.role == 'approver_1' else 2
            Approval.objects.create(
                purchase_request=self,
                approver=user,
                level=level,
                status='rejected',
                comments=comments
            )
            self.status = 'rejected'
            self.save()


class Approval(models.Model):
    STATUS_CHOICES = [
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    purchase_request = models.ForeignKey(
        PurchaseRequest,
        on_delete=models.CASCADE,
        related_name='approvals'
    )
    approver = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    level = models.IntegerField(choices=[(1, 'Level 1'), (2, 'Level 2')])
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    comments = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['purchase_request', 'level']
        ordering = ['timestamp']

    def __str__(self):
        return f"{self.purchase_request.title} - Level {self.level} - {self.status}"


class RequestItem(models.Model):
    purchase_request = models.ForeignKey(
        PurchaseRequest,
        on_delete=models.CASCADE,
        related_name='items'
    )
    item_name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.IntegerField(default=1)

    @property
    def total(self):
        return self.price * self.quantity

    def __str__(self):
        return f"{self.item_name} - {self.quantity} x {self.price}"