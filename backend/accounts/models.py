from django.contrib.auth.models import AbstractUser
from django.db import models
from core.models import TimeStampedModel

class User(AbstractUser):
    email = models.EmailField(unique=True, verbose_name='البريد الإلكتروني')
    phone_number = models.CharField(max_length=20, blank=True, null=True, verbose_name='رقم الهاتف')
    is_customer = models.BooleanField(default=True, verbose_name='عميل متجر')
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True, verbose_name='الصورة الشخصية')

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    class Meta:
        verbose_name = 'مستخدم'
        verbose_name_plural = 'المستخدمون'

    def __str__(self):
        return self.get_full_name() or self.email


class Address(TimeStampedModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='addresses', verbose_name='المستخدم')
    full_name = models.CharField(max_length=150, verbose_name='الاسم الكامل')
    phone_number = models.CharField(max_length=20, verbose_name='رقم الهاتف للتوصيل')
    city = models.CharField(max_length=80, verbose_name='المدينة', default='طرابلس')
    district = models.CharField(max_length=100, blank=True, verbose_name='المنطقة / الحي')
    street_address = models.CharField(max_length=255, verbose_name='العنوان بالتفصيل')
    landmark = models.CharField(max_length=150, blank=True, verbose_name='أقرب نقطة دالة')
    is_default = models.BooleanField(default=False, verbose_name='العنوان الافتراضي')

    class Meta:
        verbose_name = 'عنوان شحن'
        verbose_name_plural = 'عناوين الشحن'

    def save(self, *args, **kwargs):
        if self.is_default:
            Address.objects.filter(user=self.user, is_default=True).exclude(pk=self.pk).update(is_default=False)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.full_name} - {self.city}, {self.street_address}"


class CustomerDevice(TimeStampedModel):
    """Diffusers paired by customer via mobile app and synced to backend."""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='devices', verbose_name='المالك')
    device_name = models.CharField(max_length=100, default='جهاز أودورا', verbose_name='اسم الجهاز المخصص')
    model_name = models.CharField(max_length=50, default='A316', verbose_name='الموديل')
    room_name = models.CharField(max_length=80, default='غرفة المعيشة', verbose_name='الغرفة / المكان')
    mac_address = models.CharField(max_length=50, blank=True, verbose_name='معرف الجهاز (MAC/UUID)')
    intensity = models.PositiveSmallIntegerField(default=6, verbose_name='شدة التعطير (0-10)')
    oil_level = models.PositiveSmallIntegerField(default=78, verbose_name='نسبة الزيت %')
    is_power_on = models.BooleanField(default=True, verbose_name='قيد التشغيل')
    current_scent = models.CharField(max_length=100, default='Forest Sage', verbose_name='العطر الحالي')
    last_synced = models.DateTimeField(auto_now=True, verbose_name='آخر مزامنة')

    class Meta:
        verbose_name = 'جهاز معطر ذكي'
        verbose_name_plural = 'أجهزة المعطرات الذكية'

    def __str__(self):
        return f"{self.device_name} ({self.room_name}) - {self.user.email}"
