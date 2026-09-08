from decimal import Decimal
from django.db import models
from core.models import TimeStampedModel
from django.contrib.auth import get_user_model
from products.models import Product, ProductColorway

User = get_user_model()

class Cart(TimeStampedModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='carts', verbose_name='المستخدم')
    session_id = models.CharField(max_length=100, blank=True, null=True, db_index=True, verbose_name='معرف جلسة الضيف')

    class Meta:
        verbose_name = 'سلة تسوق'
        verbose_name_plural = 'سلات التسوق'

    def __str__(self):
        owner = self.user.email if self.user else f"Guest ({self.session_id})"
        return f"سلة {owner}"

    @property
    def total_items(self):
        return sum(item.quantity for item in self.items.all())

    @property
    def subtotal(self):
        return sum(item.line_total for item in self.items.all())

    @property
    def delivery_fee(self):
        # Free delivery on orders over 300 LYD
        if self.subtotal >= Decimal('300.00') or self.subtotal == Decimal('0.00'):
            return Decimal('0.00')
        return Decimal('15.00')

    @property
    def total_price(self):
        return self.subtotal + self.delivery_fee

    @property
    def free_delivery_remaining(self):
        diff = Decimal('300.00') - self.subtotal
        return max(Decimal('0.00'), diff)


class CartItem(TimeStampedModel):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items', verbose_name='السلة')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, verbose_name='المنتج')
    colorway = models.ForeignKey(ProductColorway, on_delete=models.SET_NULL, null=True, blank=True, verbose_name='خيار اللون')
    quantity = models.PositiveIntegerField(default=1, verbose_name='الكمية')

    class Meta:
        verbose_name = 'عنصر السلة'
        verbose_name_plural = 'عناصر السلة'
        unique_together = ('cart', 'product', 'colorway')

    def __str__(self):
        return f"{self.quantity}x {self.product.name_ar}"

    @property
    def unit_price(self):
        return self.product.final_price

    @property
    def line_total(self):
        return self.unit_price * self.quantity
