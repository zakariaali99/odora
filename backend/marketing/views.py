from rest_framework import viewsets, generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Coupon, NewsletterSubscriber
from .serializers import CouponAdminSerializer, CouponValidateSerializer, NewsletterSubscriberSerializer

class CouponValidateView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = CouponValidateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        code = serializer.validated_data['code'].strip().upper()
        subtotal = serializer.validated_data['subtotal']

        try:
            coupon = Coupon.objects.get(code=code)
            if not coupon.is_valid:
                return Response({
                    'valid': False,
                    'message': 'كوبون الخصم غير سارٍ أو منتهي الصلاحية'
                }, status=status.HTTP_400_BAD_REQUEST)

            if subtotal < coupon.min_purchase_amount:
                return Response({
                    'valid': False,
                    'message': f'الحد الأدنى للطلب لتفعيل هذا الكوبون هو {coupon.min_purchase_amount} د.ل'
                }, status=status.HTTP_400_BAD_REQUEST)

            discount = coupon.calculate_discount(subtotal)
            return Response({
                'valid': True,
                'code': coupon.code,
                'discount_amount': discount,
                'discount_type': coupon.discount_type,
                'discount_value': coupon.discount_value,
                'message': f'تم تفعيل خصم بقيمة {discount} د.ل بنجاح'
            })
        except Coupon.DoesNotExist:
            return Response({
                'valid': False,
                'message': 'رمز الكوبون غير صحيح'
            }, status=status.HTTP_404_NOT_FOUND)


class AdminCouponViewSet(viewsets.ModelViewSet):
    queryset = Coupon.objects.all()
    serializer_class = CouponAdminSerializer
    permission_classes = [permissions.IsAdminUser]


class NewsletterSubscribeView(generics.CreateAPIView):
    queryset = NewsletterSubscriber.objects.all()
    serializer_class = NewsletterSubscriberSerializer
    permission_classes = [permissions.AllowAny]
