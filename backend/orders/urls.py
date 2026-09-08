from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrderCreateView, OrderTrackView, UserOrderListView, AdminOrderViewSet

router = DefaultRouter()
router.register('admin-orders', AdminOrderViewSet, basename='admin-order')

urlpatterns = [
    path('checkout/', OrderCreateView.as_view(), name='order-checkout'),
    path('my-orders/', UserOrderListView.as_view(), name='user-orders'),
    path('track/<str:order_number>/', OrderTrackView.as_view(), name='order-track'),
    path('', include(router.urls)),
]
