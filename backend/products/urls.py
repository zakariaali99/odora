from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, ProductViewSet, AdminProductViewSet

router = DefaultRouter()
router.register('categories', CategoryViewSet, basename='category')
router.register('admin-products', AdminProductViewSet, basename='admin-product')
router.register('', ProductViewSet, basename='product')

urlpatterns = [
    path('', include(router.urls)),
]
