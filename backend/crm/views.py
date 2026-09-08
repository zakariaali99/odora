from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import CustomerProfile, CustomerNote
from .serializers import CustomerProfileSerializer, CustomerNoteSerializer

class AdminCustomerViewSet(viewsets.ModelViewSet):
    queryset = CustomerProfile.objects.all().prefetch_related('admin_notes')
    serializer_class = CustomerProfileSerializer
    permission_classes = [permissions.IsAdminUser]
    lookup_field = 'id'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['tag', 'origin', 'city']
    search_fields = ['name', 'phone_number', 'email', 'city']
    ordering_fields = ['total_spent', 'orders_count', 'last_order_date', 'created_at']

    @action(detail=True, methods=['post'])
    def add_note(self, request, id=None):
        customer = self.get_object()
        note_text = request.data.get('note', '').strip()
        if not note_text:
            return Response({'error': 'نص الملاحظة مطلوب'}, status=status.HTTP_400_BAD_REQUEST)

        note = CustomerNote.objects.create(
            customer=customer,
            author=request.user,
            note=note_text
        )
        return Response(CustomerNoteSerializer(note).data, status=status.HTTP_201_CREATED)
