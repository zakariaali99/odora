from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from .models import Address, CustomerDevice

User = get_user_model()

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = {
            'id': self.user.id,
            'email': self.user.email,
            'username': self.user.username,
            'first_name': self.user.first_name,
            'last_name': self.user.last_name,
            'phone_number': self.user.phone_number,
            'is_staff': self.user.is_staff,
            'is_customer': self.user.is_customer,
        }
        return data


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'first_name', 'last_name', 'phone_number', 'password']
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': False},
            'username': {'required': False},
        }

    def create(self, validated_data):
        email = validated_data['email']
        username = validated_data.get('username') or email.split('@')[0]
        # ensure unique username
        base_username = username
        counter = 1
        while User.objects.filter(username=username).exists():
            username = f"{base_username}{counter}"
            counter += 1

        user = User.objects.create_user(
            email=email,
            username=username,
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            phone_number=validated_data.get('phone_number', ''),
            password=validated_data['password'],
            is_customer=True,
        )
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'first_name', 'last_name', 'phone_number', 'is_staff', 'is_customer', 'avatar', 'date_joined']
        read_only_fields = ['id', 'email', 'is_staff', 'is_customer', 'date_joined']


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ['id', 'full_name', 'phone_number', 'city', 'district', 'street_address', 'landmark', 'is_default', 'created_at']
        read_only_fields = ['id', 'created_at']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class CustomerDeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerDevice
        fields = [
            'id', 'device_name', 'model_name', 'room_name', 'mac_address',
            'intensity', 'oil_level', 'is_power_on', 'current_scent', 'last_synced'
        ]
        read_only_fields = ['id', 'last_synced']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
