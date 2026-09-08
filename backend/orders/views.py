from rest_framework import generics, viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from .models import Order, OrderStatusLog
from .serializers import (
    OrderCreateSerializer,
    OrderDetailSerializer,
    OrderListSerializer,
    OrderStatusLogSerializer,
)

class OrderCreateView(generics.CreateAPIView):
    serializer_class = OrderCreateSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        order = serializer.save()
        return Response(OrderDetailSerializer(order).data, status=status.HTTP_201_CREATED)


class OrderTrackView(generics.RetrieveAPIView):
    serializer_class = OrderDetailSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'order_number'

    def get_object(self):
        order_number = self.kwargs['order_number'].strip()
        phone = self.request.query_params.get('phone', '').strip()
        queryset = Order.objects.filter(order_number__iexact=order_number)
        if phone:
            queryset = queryset.filter(customer_phone__icontains=phone)
        return get_object_or_404(queryset)


class UserOrderListView(generics.ListAPIView):
    serializer_class = OrderListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)


class AdminOrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().prefetch_related('items', 'status_logs')
    serializer_class = OrderDetailSerializer
    permission_classes = [permissions.IsAdminUser]
    lookup_field = 'id'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'payment_method', 'payment_status', 'shipping_city']
    search_fields = ['order_number', 'customer_name', 'customer_phone', 'customer_email']
    ordering_fields = ['created_at', 'total_amount']

    def get_serializer_class(self):
        if self.action == 'list':
            return OrderListSerializer
        return OrderDetailSerializer

    @action(detail=True, methods=['post'])
    def update_status(self, request, id=None):
        order = self.get_object()
        new_status = request.data.get('status')
        note = request.data.get('note', '')

        if new_status not in dict(Order.STATUS_CHOICES):
            return Response({'error': 'حالة الطلب غير صالحة'}, status=status.HTTP_400_BAD_REQUEST)

        order.status = new_status
        order.save(update_fields=['status'])

        OrderStatusLog.objects.create(
            order=order,
            status=new_status,
            note=note or f"تم تعديل الحالة إلى: {order.get_status_display()}"
        )
        return Response(OrderDetailSerializer(order).data)
