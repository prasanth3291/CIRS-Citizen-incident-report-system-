from rest_framework import serializers
from .models import User, Profile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}  # Ensure the password is write-only

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        
        # This should call create_user on the model's manager
        user = User.objects.create_user(
            first_name=validated_data.get('first_name'),
            last_name=validated_data.get('last_name'),
            username=validated_data.get('username'),
            email=validated_data.get('email'),
            password=password
        )
        return user

class ProfileSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='user.first_name', required=False)
    last_name = serializers.CharField(source='user.last_name', required=False)
    profile_pic = serializers.ImageField(required=False)  # Use the standard ImageField

    class Meta:
        model = Profile
        fields = [
            'profile_pic', 
            'first_name', 'last_name',
            'address_field_1', 
            'address_field_2', 
            'phone', 
            'pin', 
            'district', 
            'state'
        ]
        extra_kwargs = {
            'profile_pic': {'required': False},
            'address_field_1': {'required': False},
            'address_field_2': {'required': False},
            'phone': {'required': False},
            'pin': {'required': False},
            'district': {'required': False},
            'state': {'required': False},
        }

    def update(self, instance, validated_data):
        # Handle nested user data
        user_data = validated_data.pop('user', {})
        first_name = user_data.get('first_name')
        last_name = user_data.get('last_name')

        # Update user's first and last name if provided
        if first_name:
            instance.user.first_name = first_name
        if last_name:
            instance.user.last_name = last_name
        instance.user.save()

        # Update the Profile fields
        return super().update(instance, validated_data)
