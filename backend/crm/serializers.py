from rest_framework import serializers
from .models import CustomerProfile, CustomerNote
from accounts.serializers import CustomerDeviceSerializer

class CustomerNoteSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)

    class Meta:
        model = CustomerNote
        fields = ['id', 'note', 'author_name', 'created_at']


class CustomerProfileSerializer(serializers.ModelSerializer):
    admin_notes = CustomerNoteSerializer(many=True, read_only=True)
    tag_display = serializers.CharField(source='get_tag_display', read_only=True)
    origin_display = serializers.CharField(source='get_origin_display', read_only=True)
    devices = serializers.SerializerMethodField()

    class Meta:
        model = CustomerProfile
        fields = [
            'id', 'name', 'email', 'phone_number', 'city',
            'tag', 'tag_display', 'origin', 'origin_display',
            'total_spent', 'orders_count', 'last_order_date',
            'notes', 'admin_notes', 'devices', 'created_at'
        ]

    def get_devices(self, obj):
        if obj.user:
            return CustomerDeviceSerializer(obj.user.devices.all(), many=True).data
        return []
