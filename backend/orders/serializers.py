from rest_framework import serializers
from .models import Order, OrderItem, OrderStatusLog
from cart.models import Cart
from cart.views import get_or_create_cart
from marketing.models import Coupon
from crm.models import CustomerProfile

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'colorway_name', 'unit_price', 'quantity', 'total_price']


class OrderStatusLogSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = OrderStatusLog
        fields = ['id', 'status', 'status_display', 'note', 'created_at']


class OrderDetailSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    status_logs = OrderStatusLogSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    payment_method_display = serializers.CharField(source='get_payment_method_display', read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'customer_name', 'customer_email', 'customer_phone',
            'shipping_city', 'shipping_district', 'shipping_address', 'shipping_notes',
            'payment_method', 'payment_method_display', 'payment_status',
            'status', 'status_display',
            'subtotal', 'delivery_fee', 'discount_amount', 'total_amount', 'coupon_code',
            'items', 'status_logs', 'created_at'
        ]


class OrderListSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    items_count = serializers.IntegerField(source='items.count', read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'customer_name', 'customer_phone',
            'shipping_city', 'payment_method', 'status', 'status_display',
            'total_amount', 'items_count', 'created_at'
        ]


class OrderCreateSerializer(serializers.Serializer):
    customer_name = serializers.CharField(max_length=150)
    customer_email = serializers.EmailField(required=False, allow_blank=True)
    customer_phone = serializers.CharField(max_length=30)
    shipping_city = serializers.CharField(max_length=80)
    shipping_district = serializers.CharField(max_length=100, required=False, allow_blank=True)
    shipping_address = serializers.CharField()
    shipping_notes = serializers.CharField(required=False, allow_blank=True)
    payment_method = serializers.ChoiceField(choices=['cod', 'card'], default='cod')
    coupon_code = serializers.CharField(required=False, allow_blank=True)

    def create(self, validated_data):
        request = self.context['request']
        cart = get_or_create_cart(request)

        if not cart.items.exists():
            raise serializers.ValidationError({'error': 'سلة المشتريات فارغة، لا يمكن إتمام الطلب'})

        subtotal = cart.subtotal
        delivery_fee = cart.delivery_fee
        discount_amount = 0
        coupon_code = validated_data.get('coupon_code', '').strip().upper()

        if coupon_code:
            try:
                coupon = Coupon.objects.get(code=coupon_code, is_active=True)
                if coupon.is_valid and subtotal >= coupon.min_purchase_amount:
                    discount_amount = coupon.calculate_discount(subtotal)
                    coupon.times_used += 1
                    coupon.save(update_fields=['times_used'])
            except Exception:
                coupon_code = ''

        total_amount = max(0, subtotal + delivery_fee - discount_amount)
        user = request.user if request.user.is_authenticated else None

        order = Order.objects.create(
            user=user,
            customer_name=validated_data['customer_name'],
            customer_email=validated_data.get('customer_email', ''),
            customer_phone=validated_data['customer_phone'],
            shipping_city=validated_data['shipping_city'],
            shipping_district=validated_data.get('shipping_district', ''),
            shipping_address=validated_data['shipping_address'],
            shipping_notes=validated_data.get('shipping_notes', ''),
            payment_method=validated_data['payment_method'],
            subtotal=subtotal,
            delivery_fee=delivery_fee,
            discount_amount=discount_amount,
            total_amount=total_amount,
            coupon_code=coupon_code,
            status='placed',
        )

        # Transfer items
        for item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                product=item.product,
                product_name=item.product.name_ar or item.product.name,
                colorway_name=item.colorway.name_ar if item.colorway else '',
                unit_price=item.unit_price,
                quantity=item.quantity,
                total_price=item.line_total,
            )
            # Deduct stock
            if item.product.stock >= item.quantity:
                item.product.stock -= item.quantity
                item.product.save(update_fields=['stock'])

        # Initial status log
        OrderStatusLog.objects.create(
            order=order,
            status='placed',
            note='تم استلام الطلب وتأكيده مبدئياً عبر المتجر'
        )

        # Clear cart
        cart.items.all().delete()

        # Update CRM Profile
        try:
            profile, _ = CustomerProfile.objects.get_or_create(
                phone_number=order.customer_phone,
                defaults={
                    'name': order.customer_name,
                    'email': order.customer_email,
                    'user': user,
                    'origin': 'web' if not request.headers.get('X-Device-ID') else 'mobile'
                }
            )
            profile.total_spent += order.total_amount
            profile.orders_count += 1
            profile.last_order_date = order.created_at
            profile.save()
        except Exception:
            pass

        return order
