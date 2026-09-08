from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.db.models import Sum, Count, Q
from orders.models import Order, OrderItem
from products.models import Product
from crm.models import CustomerProfile

class DashboardStatsView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        # Revenue and orders
        orders_queryset = Order.objects.exclude(status='cancelled')
        total_revenue = orders_queryset.aggregate(Sum('total_amount'))['total_amount__sum'] or 0
        total_orders = Order.objects.count()
        delivered_orders = Order.objects.filter(status='delivered').count()
        pending_orders = Order.objects.filter(status__in=['placed', 'confirmed', 'processing']).count()

        # Customers breakdown
        total_customers = CustomerProfile.objects.count()
        web_customers = CustomerProfile.objects.filter(origin='web').count()
        mobile_customers = CustomerProfile.objects.filter(origin='mobile').count()
        both_customers = CustomerProfile.objects.filter(origin='both').count()

        # Stock alert
        low_stock_products = Product.objects.filter(stock__lte=10, is_active=True).values(
            'id', 'name_ar', 'stock', 'product_type'
        )[:10]

        # Top selling products
        top_products = (
            OrderItem.objects.values('product__name_ar', 'product__product_type')
            .annotate(total_sold=Sum('quantity'), total_sales=Sum('total_price'))
            .order_by('-total_sold')[:5]
        )

        # Recent orders
        recent_orders = Order.objects.values(
            'id', 'order_number', 'customer_name', 'shipping_city',
            'status', 'total_amount', 'created_at'
        ).order_by('-created_at')[:8]

        return Response({
            'overview': {
                'total_revenue': float(total_revenue),
                'total_orders': total_orders,
                'delivered_orders': delivered_orders,
                'pending_orders': pending_orders,
                'total_customers': total_customers,
                'currency': 'د.ل',
            },
            'customers_origin': {
                'web': web_customers,
                'mobile': mobile_customers,
                'both': both_customers,
            },
            'low_stock_alerts': list(low_stock_products),
            'top_products': list(top_products),
            'recent_orders': list(recent_orders),
        })
