from django.urls import path
from .views import HealthCheckView, BusinessConfigView

urlpatterns = [
    path('health/', HealthCheckView.as_view(), name='health-check'),
    path('config/', BusinessConfigView.as_view(), name='business-config'),
]
