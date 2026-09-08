import random
from django.db import models
from django.utils import timezone
from core.models import TimeStampedModel
from django.contrib.auth import get_user_model
from products.models import Product

User = get_user_model()

class Order(TimeStampedModel):
    STATUS_CHOICES = (
        ('placed', 'تم استلام الطلب'),
        ('confirmed', 'تم تأكيد الطلب'),
        ('processing', 'جاري التجهيز والتعبئة'),
        ('shipped', 'تم الشحن مع مندوب التوصيل'),
        ('delivered', 'تم التوصيل بنجاح'),
        ('cancelled', 'تم إلغاء الطلب'),
    )

    PAYMENT_METHOD_CHOICES = (
        ('cod', 'الدفع عند الاستلام (COD)'),
        ('card', 'بطاقة مصرفية محلية (Card)'),
    )

    PAYMENT_STATUS_CHOICES = (
        ('pending', 'معلق'),
        ('paid', 'مدفوع'),
        ('failed', 'فشل الدفع'),
        ('refunded', 'مسترجع'),
    )

    order_number = models.CharField(max_length=50, unique=True, db_index=True, verbose_name='رقم الطلب')
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='orders', verbose_name='المستخدم')
    
    # Customer contact
    customer_name = models.CharField(max_length=150, verbose_name='اسم العميل')
    customer_email = models.EmailField(blank=True, verbose_name='البريد الإلكتروني')
    customer_phone = models.CharField(max_length=30, verbose_name='رقم الهاتف للتواصل')
    
    # Delivery info
    shipping_city = models.CharField(max_length=80, default='طرابلس', verbose_name='المدينة')
    shipping_district = models.CharField(max_length=100, blank=True, verbose_name='المنطقة')
    shipping_address = models.TextField(verbose_name='العنوان بالتفصيل')
    shipping_notes = models.TextField(blank=True, verbose_name='ملاحظات التوصيل')
    
    # Payment & Financials
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES, default='cod', verbose_name='طريقة الدفع')
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending', verbose_name='حالة الدفع')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='placed', db_index=True, verbose_name='حالة الطلب')
    
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='المجموع الفرعي (د.ل)')
    delivery_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0, verbose_name='رسوم الشحن (د.ل)')
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0, verbose_name='قيمة الخصم (د.ل)')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='الإجمالي النهائي (د.ل)')
    coupon_code = models.CharField(max_length=50, blank=True, verbose_name='كوبون الخصم')

    class Meta:
        verbose_name = 'طلب'
        verbose_name_plural = 'الطلبات'
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.order_number:
            year = timezone.now().strftime('%Y')
            rand_num = random.randint(1000, 9999)
            self.order_number = f"OD-{year}-{rand_num}"
            while Order.objects.filter(order_number=self.order_number).exists():
                rand_num = random.randint(1000, 9999)
                self.order_number = f"OD-{year}-{rand_num}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.order_number} - {self.customer_name} ({self.total_amount} د.ل)"


class OrderItem(TimeStampedModel):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items', verbose_name='الطلب')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, verbose_name='المنتج')
    product_name = models.CharField(max_length=150, verbose_name='اسم المنتج وقت الشراء')
    colorway_name = models.CharField(max_length=80, blank=True, verbose_name='اللون')
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='سعر الوحدة (د.ل)')
    quantity = models.PositiveIntegerField(default=1, verbose_name='الكمية')
    total_price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='إجمالي البند (د.ل)')

    class Meta:
        verbose_name = 'بند الطلب'
        verbose_name_plural = 'بنود الطلبات'

    def __str__(self):
        return f"{self.quantity}x {self.product_name}"


class OrderStatusLog(TimeStampedModel):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='status_logs', verbose_name='الطلب')
    status = models.CharField(max_length=20, choices=Order.STATUS_CHOICES, verbose_name='الحالة')
    note = models.CharField(max_length=255, blank=True, verbose_name='ملاحظة إدارية')

    class Meta:
        verbose_name = 'سجل حالة الطلب'
        verbose_name_plural = 'سجلات حالات الطلبات'
        ordering = ['created_at']

    def __str__(self):
        return f"{self.order.order_number}: {self.get_status_display()}"
