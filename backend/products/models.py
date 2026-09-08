import uuid
from django.db import models
from django.utils.text import slugify
from core.models import TimeStampedModel
from django.contrib.auth import get_user_model

User = get_user_model()

class Category(TimeStampedModel):
    name = models.CharField(max_length=100, verbose_name='الاسم بالإنجليزية')
    name_ar = models.CharField(max_length=100, verbose_name='الاسم بالعربية')
    slug = models.SlugField(max_length=120, unique=True, blank=True, verbose_name='المعرف البرمجي')
    description = models.TextField(blank=True, verbose_name='الوصف بالإنجليزية')
    description_ar = models.TextField(blank=True, verbose_name='الوصف بالعربية')
    image = models.ImageField(upload_to='categories/', blank=True, null=True, verbose_name='صورة التصنيف')
    is_active = models.BooleanField(default=True, verbose_name='نشط')
    order = models.PositiveIntegerField(default=0, verbose_name='ترتيب العرض')

    class Meta:
        verbose_name = 'تصنيف'
        verbose_name_plural = 'التصنيفات'
        ordering = ['order', 'name']

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.name) or f"cat-{uuid.uuid4().hex[:6]}"
            self.slug = base
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name_ar} ({self.name})"


class Product(TimeStampedModel):
    TYPE_CHOICES = (
        ('diffuser', 'جهاز تعطير ذكي (Smart Diffuser)'),
        ('oil', 'زيت عطري نقي (Fragrance Oil)'),
        ('bundle', 'باقة توفيرية (Bundle)'),
        ('accessory', 'ملحقات وقطع غيار (Accessory)'),
    )

    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products', verbose_name='التصنيف')
    product_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='diffuser', verbose_name='نوع المنتج')
    name = models.CharField(max_length=150, verbose_name='الاسم بالإنجليزية')
    name_ar = models.CharField(max_length=150, verbose_name='الاسم بالعربية')
    slug = models.SlugField(max_length=180, unique=True, blank=True, verbose_name='المعرف البرمجي')
    subtitle = models.CharField(max_length=200, blank=True, verbose_name='عنوان فرعي بالإنجليزية')
    subtitle_ar = models.CharField(max_length=200, blank=True, verbose_name='عنوان فرعي بالعربية')
    description = models.TextField(verbose_name='الوصف التفصيلي بالإنجليزية')
    description_ar = models.TextField(verbose_name='الوصف التفصيلي بالعربية')
    
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='السعر (د.ل)')
    discount_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True, verbose_name='سعر الخصم (د.ل)')
    stock = models.PositiveIntegerField(default=50, verbose_name='الكمية المتوفرة في المخزون')
    sku = models.CharField(max_length=50, unique=True, blank=True, verbose_name='رمز المنتج (SKU)')
    main_image = models.ImageField(upload_to='products/', blank=True, null=True, verbose_name='الصورة الرئيسية')
    
    # Specs
    coverage_area = models.CharField(max_length=50, blank=True, default='900 m²', verbose_name='مساحة التغطية')
    capacity = models.CharField(max_length=50, blank=True, default='1000 ml', verbose_name='سعة الزيت')
    noise_level = models.CharField(max_length=50, blank=True, default='< 25 dB', verbose_name='مستوى الضجيج')
    power_spec = models.CharField(max_length=50, blank=True, default='12V / 2A', verbose_name='الجهد واستهلاك الطاقة')
    dimensions = models.CharField(max_length=50, blank=True, default='180 × 250 مم', verbose_name='الأبعاد')
    
    # Flags & Rating
    is_featured = models.BooleanField(default=False, verbose_name='مميز في الصفحة الرئيسية')
    is_active = models.BooleanField(default=True, verbose_name='معروض للبيع')
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=5.00, verbose_name='التقييم')
    reviews_count = models.PositiveIntegerField(default=0, verbose_name='عدد المراجعات')

    class Meta:
        verbose_name = 'منتج'
        verbose_name_plural = 'المنتجات'
        ordering = ['-is_featured', '-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.name) or f"prod-{uuid.uuid4().hex[:6]}"
            slug = base
            counter = 1
            while Product.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base}-{counter}"
                counter += 1
            self.slug = slug
        if not self.sku:
            self.sku = f"OD-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name_ar} ({self.price} د.ل)"

    @property
    def final_price(self):
        return self.discount_price if self.discount_price and self.discount_price > 0 else self.price

    @property
    def has_discount(self):
        return self.discount_price is not None and self.discount_price < self.price


class ProductColorway(TimeStampedModel):
    """Color options for diffuser devices (Sage Green, Matte White, Matte Black)."""
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='colorways', verbose_name='المنتج')
    name = models.CharField(max_length=80, verbose_name='اسم اللون بالإنجليزية')
    name_ar = models.CharField(max_length=80, verbose_name='اسم اللون بالعربية')
    hex_code = models.CharField(max_length=10, default='#919C7A', verbose_name='كود اللون (HEX)')
    image = models.ImageField(upload_to='products/colorways/', blank=True, null=True, verbose_name='صورة اللون')
    is_default = models.BooleanField(default=False, verbose_name='اللون الافتراضي')

    class Meta:
        verbose_name = 'خيار لون المنتج'
        verbose_name_plural = 'خيارات ألوان المنتجات'

    def __str__(self):
        return f"{self.product.name} - {self.name_ar} ({self.hex_code})"


class ScentNotePyramid(TimeStampedModel):
    """Scent note pyramid for oils (Top, Heart, Base)."""
    product = models.OneToOneField(Product, on_delete=models.CASCADE, related_name='scent_notes', verbose_name='المنتج العطري')
    scent_family = models.CharField(max_length=100, default='Woody / Herbal', verbose_name='العائلة العطرية (EN)')
    scent_family_ar = models.CharField(max_length=100, default='خشبي / عشبي', verbose_name='العائلة العطرية (AR)')
    top_notes = models.CharField(max_length=150, verbose_name='قمة العطر (EN)')
    top_notes_ar = models.CharField(max_length=150, verbose_name='قمة العطر (AR)')
    heart_notes = models.CharField(max_length=150, verbose_name='قلب العطر (EN)')
    heart_notes_ar = models.CharField(max_length=150, verbose_name='قلب العطر (AR)')
    base_notes = models.CharField(max_length=150, verbose_name='قاعدة العطر (EN)')
    base_notes_ar = models.CharField(max_length=150, verbose_name='قاعدة العطر (AR)')

    class Meta:
        verbose_name = 'هرم النوتات العطرية'
        verbose_name_plural = 'أهرام النوتات العطرية'

    def __str__(self):
        return f"هرم عطر: {self.product.name_ar}"


class ProductImage(TimeStampedModel):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images', verbose_name='المنتج')
    image = models.ImageField(upload_to='products/gallery/', verbose_name='الصورة')
    caption = models.CharField(max_length=120, blank=True, verbose_name='وصف توضيحي')
    order = models.PositiveIntegerField(default=0, verbose_name='ترتيب العرض')

    class Meta:
        verbose_name = 'صورة معرض المنتج'
        verbose_name_plural = 'معرض صور المنتجات'
        ordering = ['order', 'created_at']

    def __str__(self):
        return f"صورة {self.product.name} #{self.order}"


class Review(TimeStampedModel):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews', verbose_name='المنتج')
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='reviews', verbose_name='المستخدم')
    reviewer_name = models.CharField(max_length=100, verbose_name='اسم صاحب التقييم')
    rating = models.PositiveSmallIntegerField(default=5, verbose_name='التقييم (1-5 نجوم)')
    comment = models.TextField(verbose_name='نص المراجعة')
    is_verified_purchase = models.BooleanField(default=True, verbose_name='شراء مؤكد')
    is_approved = models.BooleanField(default=True, verbose_name='معتمد للنشر')

    class Meta:
        verbose_name = 'تقييم ومراجعة'
        verbose_name_plural = 'التقييمات والمراجعات'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.reviewer_name} - {self.product.name_ar} ({self.rating}★)"
