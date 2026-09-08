from rest_framework import serializers
from .models import Cart, CartItem
from products.models import Product, ProductColorway
from products.serializers import ProductListSerializer, ProductColorwaySerializer

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductListSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.filter(is_active=True), source='product', write_only=True
    )
    colorway = ProductColorwaySerializer(read_only=True)
    colorway_id = serializers.PrimaryKeyRelatedField(
        queryset=ProductColorway.objects.all(), source='colorway', write_only=True, required=False, allow_null=True
    )
    unit_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    line_total = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = CartItem
        fields = [
            'id', 'product', 'product_id', 'colorway', 'colorway_id',
            'quantity', 'unit_price', 'line_total'
        ]


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_items = serializers.IntegerField(read_only=True)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    delivery_fee = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    free_delivery_remaining = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Cart
        fields = [
            'id', 'items', 'total_items', 'subtotal',
            'delivery_fee', 'free_delivery_remaining', 'total_price', 'created_at'
        ]
