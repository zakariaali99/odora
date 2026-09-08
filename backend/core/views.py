from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone

class HealthCheckView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        return Response({
            'status': 'online',
            'brand': 'Odora',
            'tagline': 'Scent of atmosphere',
            'tagline_ar': 'عبير الأجواء',
            'currency': 'LYD',
            'currency_ar': 'د.ل',
            'version': '1.0.0',
            'timestamp': timezone.now().isoformat(),
        }, status=status.HTTP_200_OK)
