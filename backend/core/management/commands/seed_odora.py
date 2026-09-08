from decimal import Decimal
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from products.models import Category, Product, ProductColorway, ScentNotePyramid, Review
from cms.models import Banner, ScentStory, FAQ
from marketing.models import Coupon
from crm.models import CustomerProfile
from accounts.models import CustomerDevice, Address

User = get_user_model()

class Command(BaseCommand):
    help = 'بذر بيانات العلامة التجارية أودورا (Odora Brand Seed Data)'

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE('بدء بذر بيانات متجر ولوحة تحكم أودورا...'))

        # 1. Superuser / Admin
        admin_user, created = User.objects.get_or_create(
            email='admin@odora.ly',
            defaults={
                'username': 'admin',
                'first_name': 'مدير',
                'last_name': 'أودورا',
                'phone_number': '0910000000',
                'is_staff': True,
                'is_superuser': True,
                'is_customer': False,
            }
        )
        if created:
            admin_user.set_password('odora2026!')
            admin_user.save()
            self.stdout.write(self.style.SUCCESS('تم إنشاء المستخدم الإداري: admin@odora.ly / odora2026!'))

        # 2. Demo Customer
        customer, c_created = User.objects.get_or_create(
            email='customer@odora.ly',
            defaults={
                'username': 'customer',
                'first_name': 'عمر',
                'last_name': 'الطرابلسي',
                'phone_number': '0925551234',
                'is_staff': False,
                'is_customer': True,
            }
        )
        if c_created:
            customer.set_password('odora2026!')
            customer.save()
            Address.objects.create(
                user=customer,
                full_name='عمر الطرابلسي',
                phone_number='0925551234',
                city='طرابلس',
                district='حي الأندلس',
                street_address='شارع بن عاشور، بالقرب من المركز التجاري',
                is_default=True
            )
            CustomerDevice.objects.create(
                user=customer,
                device_name='معطر غرفة المعيشة',
                model_name='A316',
                room_name='غرفة المعيشة',
                mac_address='OD:A3:16:88:99:FF',
                intensity=6,
                oil_level=78,
                is_power_on=True,
                current_scent='Forest Sage'
            )
            CustomerProfile.objects.create(
                user=customer,
                name='عمر الطرابلسي',
                email='customer@odora.ly',
                phone_number='0925551234',
                city='طرابلس',
                tag='vip',
                origin='both',
                total_spent=Decimal('320.00'),
                orders_count=1
            )
            self.stdout.write(self.style.SUCCESS('تم إنشاء العميل التجريبي: customer@odora.ly'))

        # 3. Categories
        cat_diffusers, _ = Category.objects.get_or_create(
            slug='diffusers',
            defaults={
                'name': 'Smart Diffusers',
                'name_ar': 'أجهزة التعطير الذكية',
                'description': 'Waterless cold-air electronic diffusers for homes, offices, and commercial spaces.',
                'description_ar': 'أجهزة تعطير إلكترونية بتقنية النانو كولد أير بدون ماء للمنازل والمكاتب والفنادق.',
                'order': 1,
            }
        )

        cat_oils, _ = Category.objects.get_or_create(
            slug='fragrance-oils',
            defaults={
                'name': 'Fragrance Oils',
                'name_ar': 'الزيوت العطرية النقية',
                'description': 'Pure luxury fragrance oils crafted specifically for cold-air diffusers.',
                'description_ar': 'زيوت عطرية فاخرة نقية 100% مستخلصة ومصممة خصيصاً لأجهزة الرذاذ البارد.',
                'order': 2,
            }
        )

        cat_bundles, _ = Category.objects.get_or_create(
            slug='bundles',
            defaults={
                'name': 'Bundles',
                'name_ar': 'الباقات الحصرية',
                'description': 'Curated diffuser and oil sets with exclusive savings.',
                'description_ar': 'مجموعات متكاملة تضم أجهزة التعطير مع زيوت مختارة بأسعار توفيرية.',
                'order': 3,
            }
        )

        # 4. Products
        # Product 1: Odora Diffuser A316
        diffuser, d_created = Product.objects.get_or_create(
            slug='odora-diffuser-a316',
            defaults={
                'category': cat_diffusers,
                'product_type': 'diffuser',
                'name': 'Odora Smart Diffuser A316',
                'name_ar': 'جهاز أودورا A316 الذكي',
                'subtitle': 'Electronic Diffuser · 900 m²',
                'subtitle_ar': 'جهاز تعطير ذكي فائق الهدوء · تغطية حتى 900 م²',
                'description': 'Waterless cold-air diffusion for spaces up to 900 m². Whisper-quiet, app-controlled scheduling, and a soft matte finish designed to sit beautifully in any room.',
                'description_ar': 'تقنية الرذاذ البارد بدون ماء لمساحات تصل إلى 900 متر مربع. هدوء فائق أقل من 25 ديسيبل، تحكم وجدولة ذكية عبر التطبيق، وتشطيب مطفي راقٍ يتناغم مع أرقى الديكورات.',
                'price': Decimal('320.00'),
                'stock': 45,
                'coverage_area': '900 m²',
                'capacity': '1000 ml',
                'noise_level': '< 25 dB',
                'power_spec': '12V / 2A',
                'dimensions': '180 × 250 مم',
                'is_featured': True,
                'rating': Decimal('4.85'),
                'reviews_count': 214,
            }
        )
        if d_created or not diffuser.colorways.exists():
            ProductColorway.objects.get_or_create(
                product=diffuser,
                name='Sage Green',
                defaults={'name_ar': 'أخضر مريمي', 'hex_code': '#919C7A', 'is_default': True}
            )
            ProductColorway.objects.get_or_create(
                product=diffuser,
                name='Matte White',
                defaults={'name_ar': 'أبيض مطفي', 'hex_code': '#E8E3DA', 'is_default': False}
            )
            ProductColorway.objects.get_or_create(
                product=diffuser,
                name='Matte Black',
                defaults={'name_ar': 'أسود فاحم', 'hex_code': '#1C1C1A', 'is_default': False}
            )

        # Product 2: Forest Sage Fragrance Oil
        oil_sage, _ = Product.objects.get_or_create(
            slug='forest-sage-fragrance-oil',
            defaults={
                'category': cat_oils,
                'product_type': 'oil',
                'name': 'Forest Sage Fragrance Oil',
                'name_ar': 'زيت مريمية الغابة النقي',
                'subtitle': 'Pure Fragrance Oil · 1000 ml',
                'subtitle_ar': 'زيت عطري نقي فاخر · 1000 مل',
                'description': 'A calm, grounding scent of wild sage, bergamot, and crisp cedar. Crafted with natural botanicals for long-lasting diffusion.',
                'description_ar': 'توليفة عطرية مهدئة وراقية من المريمية البرية والبرغموت المنعش مع خشب الأرز الدافئ. تركيبة نقية تمنح أجواءك فخامة مستمرة.',
                'price': Decimal('45.00'),
                'stock': 120,
                'capacity': '1000 ml',
                'is_featured': True,
                'rating': Decimal('4.90'),
                'reviews_count': 98,
            }
        )
        ScentNotePyramid.objects.get_or_create(
            product=oil_sage,
            defaults={
                'scent_family': 'Woody / Herbal',
                'scent_family_ar': 'خشبي / عشبي هادئ',
                'top_notes': 'Bergamot · Eucalyptus',
                'top_notes_ar': 'برغموت نقي · أوكالبتوس منعش',
                'heart_notes': 'Sage · Cedar',
                'heart_notes_ar': 'مريمية الغابة · خشب الأرز',
                'base_notes': 'Amber · Musk',
                'base_notes_ar': 'عنبر فاخر · مسك أبيض',
            }
        )

        # Product 3: Cotton Linen Fragrance Oil
        oil_linen, _ = Product.objects.get_or_create(
            slug='cotton-linen-fragrance-oil',
            defaults={
                'category': cat_oils,
                'product_type': 'oil',
                'name': 'Cotton Linen Fragrance Oil',
                'name_ar': 'زيت ندى الكتان والقطن',
                'subtitle': 'Clean & Crisp · 1000 ml',
                'subtitle_ar': 'انتعاش الكتان النقي · 1000 مل',
                'description': 'Crisp white tea, soft linen, and gentle jasmine. Evokes freshly laundered linen drying in Mediterranean sunlight.',
                'description_ar': 'عبير نقي يجمع الشاي الأبيض وزهر الكتان مع لمسات الياسمين الهادئة، ليحاكي نقاء الأقمشة الفاخرة تحت شمس المتوسط.',
                'price': Decimal('45.00'),
                'stock': 85,
                'capacity': '1000 ml',
                'is_featured': True,
                'rating': Decimal('4.75'),
                'reviews_count': 64,
            }
        )
        ScentNotePyramid.objects.get_or_create(
            product=oil_linen,
            defaults={
                'scent_family': 'Fresh / Floral',
                'scent_family_ar': 'منعش قطني نقي',
                'top_notes': 'White Tea · Sicilian Lemon',
                'top_notes_ar': 'شاي أبيض · ليمون صقلي',
                'heart_notes': 'Linen Flower · Gentle Jasmine',
                'heart_notes_ar': 'زهر الكتان · ياسمين ناعم',
                'base_notes': 'Cashmere Wood · Sheer Musk',
                'base_notes_ar': 'خشب الكشمير · مسك شفاف',
            }
        )

        # Product 4: Odora Signature Bundle
        bundle, _ = Product.objects.get_or_create(
            slug='odora-signature-bundle',
            defaults={
                'category': cat_bundles,
                'product_type': 'bundle',
                'name': 'Odora Signature Bundle',
                'name_ar': 'باقة أودورا المتكاملة (جهاز + 2 زيت)',
                'subtitle': 'Diffuser + Forest Sage + Cotton Linen',
                'subtitle_ar': 'جهاز التعطير A316 مع زيت مريمية الغابة وزيت الكتان',
                'description': 'Complete luxury set: One Odora Smart Diffuser A316 and two 1000ml pure fragrance oils at a special bundled price.',
                'description_ar': 'المجموعة المتكاملة: جهاز تعطير أودورا الذكي A316 مع عبوتين سعة 1000 مل من أروع الزيوت العطرية بسعر خاص ومميز.',
                'price': Decimal('410.00'),
                'discount_price': Decimal('380.00'),
                'stock': 30,
                'is_featured': True,
                'rating': Decimal('5.00'),
                'reviews_count': 52,
            }
        )

        # 5. Reviews
        Review.objects.get_or_create(
            product=diffuser,
            reviewer_name='ليلى السويحلي',
            defaults={
                'rating': 5,
                'comment': 'غيّر تماماً من أجواء المعرض لدينا. يلاحظه الزبائن ويثنون على الرائحة الهادئة فور دخولهم.',
                'is_verified_purchase': True
            }
        )
        Review.objects.get_or_create(
            product=diffuser,
            reviewer_name='عمر الشريف',
            defaults={
                'rating': 5,
                'comment': 'قطعة ديكور فاخرة، هادئ جداً بدون صوت، وميزة الجدولة الأسبوعية تعمل بدقة واحترافية.',
                'is_verified_purchase': True
            }
        )
        Review.objects.get_or_create(
            product=diffuser,
            reviewer_name='سارة القرقني',
            defaults={
                'rating': 5,
                'comment': 'نستخدم 4 أجهزة في مرافق الفندق ونتحكم بها جميعاً بسهولة تامة. جودة استثنائية.',
                'is_verified_purchase': True
            }
        )

        # 6. CMS Banners
        Banner.objects.get_or_create(
            title='The perfect atmosphere, in every space.',
            defaults={
                'title_ar': 'عبير متجدد وأجواء هادئة تأسر الحواس في كل زاوية.',
                'subtitle': 'Premium electronic diffusers that blend advanced technology with elegant interior design.',
                'subtitle_ar': 'أجهزة تعطير ذكية تجمع التقنية المتطورة مع التصميم الداخلي الفاخر.',
                'button_text': 'Shop diffusers',
                'button_text_ar': 'تسوق أجهزة التعطير',
                'link_url': '/products?category=diffusers',
                'position': 'hero',
                'order': 1,
            }
        )

        Banner.objects.get_or_create(
            title='Crafted to be seen, and felt.',
            defaults={
                'title_ar': 'صُنعت لتُرى وتُحس.. عبير يلتقي بالأناقة',
                'subtitle': 'Every Odora piece is designed to sit beautifully in your space — minimal, natural, and quietly luxurious.',
                'subtitle_ar': 'صُممت كل قطعة من أودورا لتمنح مساحتك فخامة هادئة وتصميماً ملهماً مستوحى من الطبيعة.',
                'button_text': 'Discover collection',
                'button_text_ar': 'استكشف المجموعة الكاملة',
                'link_url': '/products',
                'position': 'brand_band',
                'order': 2,
            }
        )

        # 7. FAQs
        FAQ.objects.get_or_create(
            question='How does waterless cold-air diffusion work?',
            defaults={
                'question_ar': 'كيف تعمل تقنية التعطير بالرذاذ البارد بدون ماء؟',
                'answer': 'Our diffusers use cold-air micro-nebulization to convert pure fragrance oil into ultra-fine nanoparticles without heat or water, preserving the oil integrity and ensuring consistent scent.',
                'answer_ar': 'تعتمد أجهزتنا على ضغط الهواء البارد لتحويل الزيت العطري النقي إلى جزيئات نانوية متناهية الدقة دون تسخين أو تخفيف بالماء، مما يحافظ على نقاء الزيت ويضمن انتشاراً متوازناً.',
                'category': 'diffusers',
                'order': 1,
            }
        )
        FAQ.objects.get_or_create(
            question='How long does a 1000ml bottle last?',
            defaults={
                'question_ar': 'كم تدوم زجاجة الزيت العطري سعة 1000 مل؟',
                'answer': 'Under typical commercial use (8 hours a day at medium intensity), a 1000ml bottle lasts approximately 60 to 90 days.',
                'answer_ar': 'عند الاستخدام المعتاد (8 ساعات يومياً بشدة متوسطة)، تكفي عبوة 1000 مل لمدة تتراوح بين شهرين إلى 3 أشهر.',
                'category': 'oils',
                'order': 2,
            }
        )
        FAQ.objects.get_or_create(
            question='What is the warranty period in Libya?',
            defaults={
                'question_ar': 'ما هي فترة الضمان وخدمة ما بعد البيع في ليبيا؟',
                'answer': 'All Odora smart diffusers come with a 1-year comprehensive warranty with local maintenance and replacement parts available in Tripoli, Misrata, and Benghazi.',
                'answer_ar': 'تتمتع كافة أجهزة أودورا بضمان شامل لمدة عام كامل مع توفر قطع الغيار والصيانة وخدمة الدعم الفني في طرابلس ومصراتة وبنغازي.',
                'category': 'warranty',
                'order': 3,
            }
        )

        # 8. Coupons
        Coupon.objects.get_or_create(
            code='ODORA10',
            defaults={
                'discount_type': 'percentage',
                'discount_value': Decimal('10.00'),
                'min_purchase_amount': Decimal('100.00'),
                'usage_limit': 500,
            }
        )
        Coupon.objects.get_or_create(
            code='WELCOME',
            defaults={
                'discount_type': 'fixed',
                'discount_value': Decimal('20.00'),
                'min_purchase_amount': Decimal('150.00'),
                'usage_limit': 1000,
            }
        )

        self.stdout.write(self.style.SUCCESS('تم اكتمال بذر بيانات أودورا بنجاح!'))
