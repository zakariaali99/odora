from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CouponValidateView, AdminCouponViewSet, NewsletterSubscribeView

router = DefaultRouter()
router.register('admin-coupons', AdminCouponViewSet, basename='admin-coupon')

urlpatterns = [
    path('coupons/validate/', CouponValidateView.as_view(), name='coupon-validate'),
    path('newsletter/subscribe/', NewsletterSubscribeView.as_view(), name='newsletter-subscribe'),
    path('', include(router.urls)),
]
