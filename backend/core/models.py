import uuid
from django.db import models

class TimeStampedModel(models.Model):
    """Abstract base model with UUID and timestamp tracking."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاريخ الإنشاء')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='تاريخ آخر تعديل')

    class Meta:
        abstract = True
        ordering = ['-created_at']
