from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Product, ProductColorway, Review
from .serializers import (
    CategorySerializer,
    ProductListSerializer,
    ProductDetailSerializer,
    ProductAdminSerializer,
    ProductColorwaySerializer,
    ReviewSerializer,
)

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.filter(is_active=True).select_related('category', 'scent_notes').prefetch_related('colorways', 'images', 'reviews')
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['product_type', 'is_featured', 'category__slug']
    search_fields = ['name', 'name_ar', 'description', 'description_ar', 'subtitle', 'subtitle_ar']
    ordering_fields = ['price', 'rating', 'created_at', 'stock']
    ordering = ['-is_featured', '-created_at']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProductDetailSerializer
        return ProductListSerializer

    @action(detail=False, methods=['get'])
    def featured(self, request):
        featured_products = self.get_queryset().filter(is_featured=True)[:6]
        serializer = ProductListSerializer(featured_products, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[permissions.AllowAny])
    def add_review(self, request, slug=None):
        product = self.get_object()
        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user if request.user.is_authenticated else None
            review = serializer.save(product=product, user=user)
            # update aggregate rating
            reviews = product.reviews.filter(is_approved=True)
            product.reviews_count = reviews.count()
            if product.reviews_count > 0:
                total_stars = sum(r.rating for r in reviews)
                product.rating = round(total_stars / product.reviews_count, 2)
            product.save(update_fields=['rating', 'reviews_count'])
            return Response(ReviewSerializer(review).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminProductViewSet(viewsets.ModelViewSet):
    """Admin Dashboard ViewSet for managing products with full CRUD."""
    queryset = Product.objects.all().select_related('category').prefetch_related('colorways', 'images')
    serializer_class = ProductAdminSerializer
    permission_classes = [permissions.IsAdminUser]
    lookup_field = 'id'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['product_type', 'is_active', 'category']
    search_fields = ['name', 'name_ar', 'sku']
    ordering_fields = ['stock', 'price', 'created_at']

    @action(detail=True, methods=['post'])
    def update_stock(self, request, id=None):
        product = self.get_object()
        stock = request.data.get('stock')
        if stock is not None:
            try:
                product.stock = int(stock)
                product.save(update_fields=['stock'])
                return Response({'status': 'success', 'stock': product.stock})
            except ValueError:
                return Response({'error': 'Invalid stock value'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'error': 'stock field required'}, status=status.HTTP_400_BAD_REQUEST)
