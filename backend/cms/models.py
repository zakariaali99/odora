from django.db import models
from core.models import TimeStampedModel

class Banner(TimeStampedModel):
    POSITION_CHOICES = (
        ('hero', 'البانر الرئيسي الأعلى'),
        ('middle', 'بانر منتصف الصفحة'),
        ('brand_band', 'شريط الهوية والقصة'),
    )

    title = models.CharField(max_length=150, verbose_name='العنوان بالإنجليزية')
    title_ar = models.CharField(max_length=150, verbose_name='العنوان بالعربية')
    subtitle = models.CharField(max_length=255, blank=True, verbose_name='العنوان الفرعي بالإنجليزية')
    subtitle_ar = models.CharField(max_length=255, blank=True, verbose_name='العنوان الفرعي بالعربية')
    button_text = models.CharField(max_length=50, default='Shop Now', verbose_name='نص الزر بالإنجليزية')
    button_text_ar = models.CharField(max_length=50, default='تسوق الآن', verbose_name='نص الزر بالعربية')
    link_url = models.CharField(max_length=200, default='/shop', verbose_name='رابط التوجيه')
    image = models.ImageField(upload_to='cms/banners/', verbose_name='صورة البانر')
    position = models.CharField(max_length=30, choices=POSITION_CHOICES, default='hero', verbose_name='الموقع في الصفحة')
    order = models.PositiveIntegerField(default=0, verbose_name='الترتيب')
    is_active = models.BooleanField(default=True, verbose_name='نشط')

    class Meta:
        verbose_name = 'بانر إعلاني'
        verbose_name_plural = 'البانرات الإعلانية'
        ordering = ['order', '-created_at']

    def __str__(self):
        return f"{self.title_ar} ({self.get_position_display()})"


class ScentStory(TimeStampedModel):
    title = models.CharField(max_length=120, verbose_name='اسم العطر بالإنجليزية')
    title_ar = models.CharField(max_length=120, verbose_name='اسم العطر بالعربية')
    tagline = models.CharField(max_length=150, blank=True, verbose_name='وصف مختصر')
    story = models.TextField(verbose_name='قصة العطر بالإنجليزية')
    story_ar = models.TextField(verbose_name='قصة العطر بالعربية')
    image = models.ImageField(upload_to='cms/scents/', blank=True, null=True, verbose_name='صورة العطر')
    top_note = models.CharField(max_length=100, blank=True, verbose_name='قمة النوتات')
    heart_note = models.CharField(max_length=100, blank=True, verbose_name='قلب النوتات')
    base_note = models.CharField(max_length=100, blank=True, verbose_name='قاعدة النوتات')
    is_active = models.BooleanField(default=True, verbose_name='نشط')

    class Meta:
        verbose_name = 'قصة عطرية'
        verbose_name_plural = 'مكتبة القصص العطرية'

    def __str__(self):
        return self.title_ar


class FAQ(TimeStampedModel):
    CATEGORY_CHOICES = (
        ('diffusers', 'أجهزة التعطير'),
        ('oils', 'الزيوت العطرية'),
        ('shipping', 'الشحن والتوصيل'),
        ('warranty', 'الضمان والصيانة'),
    )

    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES, default='diffusers', verbose_name='التصنيف')
    question = models.CharField(max_length=255, verbose_name='السؤال بالإنجليزية')
    question_ar = models.CharField(max_length=255, verbose_name='السؤال بالعربية')
    answer = models.TextField(verbose_name='الإجابة بالإنجليزية')
    answer_ar = models.TextField(verbose_name='الإجابة بالعربية')
    order = models.PositiveIntegerField(default=0, verbose_name='الترتيب')
    is_active = models.BooleanField(default=True, verbose_name='نشط')

    class Meta:
        verbose_name = 'سؤال شائع'
        verbose_name_plural = 'الأسئلة الشائعة'
        ordering = ['category', 'order']

    def __str__(self):
        return self.question_ar


class ContactMessage(TimeStampedModel):
    name = models.CharField(max_length=120, verbose_name='الاسم')
    email = models.EmailField(verbose_name='البريد الإلكتروني')
    phone = models.CharField(max_length=30, blank=True, verbose_name='رقم الهاتف')
    subject = models.CharField(max_length=200, verbose_name='الموضوع')
    message = models.TextField(verbose_name='نص الرسالة')
    is_resolved = models.BooleanField(default=False, verbose_name='تمت المتابعة والحل')

    class Meta:
        verbose_name = 'رسالة تواصل'
        verbose_name_plural = 'رسائل التواصل'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.subject}"
