import uuid
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.shortcuts import get_object_or_404
from .models import Cart, CartItem
from .serializers import CartSerializer, CartItemSerializer
from products.models import Product, ProductColorway

def get_or_create_cart(request):
    """Retrieves or creates a cart for authenticated user or guest session."""
    session_id = request.headers.get('X-Session-ID') or request.query_params.get('session_id')
    
    if request.user.is_authenticated:
        cart, created = Cart.objects.get_or_create(user=request.user)
        # Check if there was a guest cart to merge
        if session_id:
            try:
                guest_cart = Cart.objects.get(session_id=session_id)
                for g_item in guest_cart.items.all():
                    item, i_created = CartItem.objects.get_or_create(
                        cart=cart,
                        product=g_item.product,
                        colorway=g_item.colorway,
                        defaults={'quantity': g_item.quantity}
                    )
                    if not i_created:
                        item.quantity += g_item.quantity
                        item.save(update_fields=['quantity'])
                guest_cart.delete()
            except Cart.DoesNotExist:
                pass
        return cart

    if not session_id:
        session_id = str(uuid.uuid4())
    cart, created = Cart.objects.get_or_create(session_id=session_id)
    return cart


class CartView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        cart = get_or_create_cart(request)
        serializer = CartSerializer(cart, context={'request': request})
        response = Response(serializer.data)
        if cart.session_id:
            response['X-Session-ID'] = cart.session_id
        return response


class AddCartItemView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        cart = get_or_create_cart(request)
        product_id = request.data.get('product_id')
        colorway_id = request.data.get('colorway_id')
        quantity = int(request.data.get('quantity', 1))

        if not product_id:
            return Response({'error': 'product_id مطلوب'}, status=status.HTTP_400_BAD_REQUEST)

        product = get_object_or_404(Product, id=product_id, is_active=True)
        colorway = None
        if colorway_id:
            colorway = get_object_or_404(ProductColorway, id=colorway_id, product=product)

        item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            colorway=colorway,
            defaults={'quantity': quantity}
        )
        if not created:
            item.quantity += quantity
            item.save(update_fields=['quantity'])

        serializer = CartSerializer(cart, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class CartItemDetailView(APIView):
    permission_classes = [permissions.AllowAny]

    def patch(self, request, item_id):
        cart = get_or_create_cart(request)
        item = get_object_or_404(CartItem, id=item_id, cart=cart)
        quantity = request.data.get('quantity')
        if quantity is not None:
            q = int(quantity)
            if q <= 0:
                item.delete()
            else:
                item.quantity = q
                item.save(update_fields=['quantity'])
        serializer = CartSerializer(cart, context={'request': request})
        return Response(serializer.data)

    def delete(self, request, item_id):
        cart = get_or_create_cart(request)
        item = get_object_or_404(CartItem, id=item_id, cart=cart)
        item.delete()
        serializer = CartSerializer(cart, context={'request': request})
        return Response(serializer.data)


class ClearCartView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        cart = get_or_create_cart(request)
        cart.items.all().delete()
        serializer = CartSerializer(cart, context={'request': request})
        return Response(serializer.data)
