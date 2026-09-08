from rest_framework import serializers
from .models import Category, Product, ProductColorway, ScentNotePyramid, ProductImage, Review

class CategorySerializer(serializers.ModelSerializer):
    products_count = serializers.IntegerField(source='products.count', read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'name_ar', 'slug', 'description', 'description_ar', 'image', 'is_active', 'order', 'products_count']


class ProductColorwaySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductColorway
        fields = ['id', 'name', 'name_ar', 'hex_code', 'image', 'is_default']


class ScentNotePyramidSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScentNotePyramid
        fields = [
            'id', 'scent_family', 'scent_family_ar',
            'top_notes', 'top_notes_ar',
            'heart_notes', 'heart_notes_ar',
            'base_notes', 'base_notes_ar'
        ]


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'caption', 'order']


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'reviewer_name', 'rating', 'comment', 'is_verified_purchase', 'created_at']
        read_only_fields = ['id', 'is_verified_purchase', 'created_at']


class ProductListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_name_ar = serializers.CharField(source='category.name_ar', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    final_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    has_discount = serializers.BooleanField(read_only=True)
    colorways = ProductColorwaySerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'name_ar', 'slug', 'product_type',
            'category', 'category_name', 'category_name_ar', 'category_slug',
            'subtitle', 'subtitle_ar', 'price', 'discount_price', 'final_price', 'has_discount',
            'stock', 'sku', 'main_image', 'is_featured', 'rating', 'reviews_count',
            'colorways', 'created_at'
        ]


class ProductDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True
    )
    final_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    has_discount = serializers.BooleanField(read_only=True)
    colorways = ProductColorwaySerializer(many=True, read_only=True)
    scent_notes = ScentNotePyramidSerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'name_ar', 'slug', 'product_type',
            'category', 'category_id', 'subtitle', 'subtitle_ar',
            'description', 'description_ar', 'price', 'discount_price', 'final_price', 'has_discount',
            'stock', 'sku', 'main_image',
            'coverage_area', 'capacity', 'noise_level', 'power_spec', 'dimensions',
            'is_featured', 'is_active', 'rating', 'reviews_count',
            'colorways', 'scent_notes', 'images', 'reviews', 'created_at'
        ]


class ProductAdminSerializer(serializers.ModelSerializer):
    """Serializer for Dashboard CRUD with automatic slug and sku generation."""
    category_name_ar = serializers.CharField(source='category.name_ar', read_only=True)

    class Meta:
        model = Product
        fields = '__all__'
        read_only_fields = ['id', 'slug', 'sku', 'rating', 'reviews_count', 'created_at', 'updated_at']
