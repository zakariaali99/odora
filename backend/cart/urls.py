from django.urls import path
from .views import CartView, AddCartItemView, CartItemDetailView, ClearCartView

urlpatterns = [
    path('', CartView.as_view(), name='cart-detail'),
    path('items/', AddCartItemView.as_view(), name='cart-add-item'),
    path('items/<uuid:item_id>/', CartItemDetailView.as_view(), name='cart-item-detail'),
    path('clear/', ClearCartView.as_view(), name='cart-clear'),
]
