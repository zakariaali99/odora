from decimal import Decimal
from django.db import models
from django.utils import timezone
from core.models import TimeStampedModel

class Coupon(TimeStampedModel):
    DISCOUNT_TYPE_CHOICES = (
        ('percentage', 'نسبة مئوية (%)'),
        ('fixed', 'مبلغ ثابت (د.ل)'),
    )

    code = models.CharField(max_length=50, unique=True, db_index=True, verbose_name='كود الخصم')
    discount_type = models.CharField(max_length=20, choices=DISCOUNT_TYPE_CHOICES, default='percentage', verbose_name='نوع الخصم')
    discount_value = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='قيمة الخصم')
    min_purchase_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0, verbose_name='الحد الأدنى للطلب (د.ل)')
    max_discount_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, verbose_name='الحد الأقصى للخصم (د.ل)')
    valid_from = models.DateTimeField(default=timezone.now, verbose_name='صالح من')
    valid_until = models.DateTimeField(null=True, blank=True, verbose_name='صالح حتى')
    usage_limit = models.PositiveIntegerField(default=100, verbose_name='الحد الأقصى للاستخدام')
    times_used = models.PositiveIntegerField(default=0, verbose_name='مرات الاستخدام')
    is_active = models.BooleanField(default=True, verbose_name='نشط')

    class Meta:
        verbose_name = 'كوبون خصم'
        verbose_name_plural = 'كوبونات الخصم'
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        self.code = self.code.strip().upper()
        super().save(*args, **kwargs)

    @property
    def is_valid(self):
        now = timezone.now()
        if not self.is_active:
            return False
        if self.valid_until and now > self.valid_until:
            return False
        if now < self.valid_from:
            return False
        if self.usage_limit and self.times_used >= self.usage_limit:
            return False
        return True

    def calculate_discount(self, subtotal):
        if not self.is_valid or subtotal < self.min_purchase_amount:
            return Decimal('0.00')

        if self.discount_type == 'percentage':
            discount = (subtotal * self.discount_value) / Decimal('100.00')
            if self.max_discount_amount:
                discount = min(discount, self.max_discount_amount)
            return round(discount, 2)
        else:
            return min(self.discount_value, subtotal)

    def __str__(self):
        return f"{self.code} ({self.get_discount_type_display()} {self.discount_value})"


class NewsletterSubscriber(TimeStampedModel):
    email = models.EmailField(unique=True, verbose_name='البريد الإلكتروني')
    is_active = models.BooleanField(default=True, verbose_name='مشترك نشط')

    class Meta:
        verbose_name = 'مشترك نشرة بريدية'
        verbose_name_plural = 'مشتركو النشرة البريدية'

    def __str__(self):
        return self.email
