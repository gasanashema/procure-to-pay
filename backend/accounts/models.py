from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    ROLE_CHOICES = [
        ('staff', 'Staff'),
        ('approver_1', 'Approver Level 1'),
        ('approver_2', 'Approver Level 2'),
        ('finance', 'Finance'),
    ]

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default='staff',
        help_text="User role in the procurement system"
    )

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"