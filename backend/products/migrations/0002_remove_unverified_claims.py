from django.db import migrations

def update_unverified_claims(apps, schema_editor):
    Product = apps.get_model('products', 'Product')
    
    # Clear noise_level and coverage_area on all products
    Product.objects.all().update(noise_level='', coverage_area='')
    
    # Update odora-diffuser-a316 specifically
    Product.objects.filter(slug='odora-diffuser-a316').update(
        subtitle='Smart Cold-Air Diffuser · Bluetooth',
        subtitle_ar='جهاز تعطير ذكي بالهواء البارد · بلوتوث',
        description='Waterless cold-air diffusion with app control over Bluetooth: set the intensity, choose continuous or interval mode, and schedule it for every day of the week. A soft matte finish in three colours.',
        description_ar='تعطير بالهواء البارد بدون ماء مع تحكم كامل من التطبيق عبر البلوتوث: اضبط الكثافة، واختر التشغيل المستمر أو بالفترات، وجدوِل التشغيل لكل أيام الأسبوع. تشطيب مطفي ناعم بثلاثة ألوان.',
        noise_level='',
        coverage_area='',
    )

def reverse_update(apps, schema_editor):
    pass

class Migration(migrations.Migration):

    dependencies = [
        ('products', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(update_unverified_claims, reverse_update),
    ]
