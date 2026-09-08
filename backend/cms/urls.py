from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BannerViewSet, ScentStoryViewSet, FAQViewSet, ContactMessageCreateView

router = DefaultRouter()
router.register('banners', BannerViewSet, basename='banner')
router.register('scent-stories', ScentStoryViewSet, basename='scent-story')
router.register('faqs', FAQViewSet, basename='faq')

urlpatterns = [
    path('contact/', ContactMessageCreateView.as_view(), name='contact-us'),
    path('', include(router.urls)),
]
