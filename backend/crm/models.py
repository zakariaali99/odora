from django.db import models
from core.models import TimeStampedModel
from django.contrib.auth import get_user_model

User = get_user_model()

class CustomerProfile(TimeStampedModel):
    TAG_CHOICES = (
        ('vip', 'عميل مميز (VIP)'),
        ('regular', 'عميل دائم'),
        ('new', 'عميل جديد'),
        ('inactive', 'غير نشط'),
    )

    ORIGIN_CHOICES = (
        ('web', 'المتجر الإلكتروني (Web)'),
        ('mobile', 'تطبيق الموبايل (App)'),
        ('both', 'المنصتان (Web & App)'),
    )

    user = models.OneToOneField(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='crm_profile', verbose_name='حساب المستخدم')
    name = models.CharField(max_length=150, verbose_name='اسم العميل')
    email = models.EmailField(blank=True, verbose_name='البريد الإلكتروني')
    phone_number = models.CharField(max_length=30, unique=True, db_index=True, verbose_name='رقم الهاتف')
    city = models.CharField(max_length=80, blank=True, default='طرابلس', verbose_name='المدينة')
    
    tag = models.CharField(max_length=20, choices=TAG_CHOICES, default='new', verbose_name='تصنيف العميل')
    origin = models.CharField(max_length=20, choices=ORIGIN_CHOICES, default='web', verbose_name='مصدر العميل')
    
    total_spent = models.DecimalField(max_digits=12, decimal_places=2, default=0, verbose_name='إجمالي المشتريات (د.ل)')
    orders_count = models.PositiveIntegerField(default=0, verbose_name='عدد الطلبات')
    last_order_date = models.DateTimeField(null=True, blank=True, verbose_name='تاريخ آخر طلب')
    notes = models.TextField(blank=True, verbose_name='ملاحظات عامة')

    class Meta:
        verbose_name = 'ملف عميل CRM'
        verbose_name_plural = 'سجل العملاء CRM'
        ordering = ['-total_spent', '-created_at']

    def __str__(self):
        return f"{self.name} ({self.phone_number}) - {self.get_tag_display()}"


class CustomerNote(TimeStampedModel):
    customer = models.ForeignKey(CustomerProfile, on_delete=models.CASCADE, related_name='admin_notes', verbose_name='العميل')
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, verbose_name='كاتب الملاحظة')
    note = models.TextField(verbose_name='نص الملاحظة الإدارية')

    class Meta:
        verbose_name = 'ملاحظة عميل'
        verbose_name_plural = 'ملاحظات العملاء'
        ordering = ['-created_at']

    def __str__(self):
        return f"ملاحظة لـ {self.customer.name}"
