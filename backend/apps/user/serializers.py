from django.contrib.auth import authenticate
from django.contrib.auth.models import update_last_login
from rest_framework import serializers

from .models import LearningHistory, User


class UserCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['email', 'name', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(  # User 생성
            email=validated_data['email'],
            name=validated_data['name'],
            password=validated_data['password']
        )

        user.save()
        return user


class IdCheckSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email']

    def validate(self, attrs):
        if User.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError(
                {'email', ('해당 이메일은 이미 사용중입니다.')})
        return super().validate(attrs)


class UserLoginSerializer(serializers.Serializer):
    email = serializers.CharField(max_length=64)
    password = serializers.CharField(max_length=128, write_only=True)
    access_token = serializers.CharField(max_length=150, read_only=True)
    refresh_token = serializers.CharField(max_length=150, read_only=True)
    name = serializers.CharField(max_length=100, read_only=True)

    def validate(self, attrs):
        email = attrs.get("email", None)
        password = attrs.get("password", None)
        user = authenticate(email=email, password=password)

        if user is None:
            return {
                'email': 'None'
            }

        update_last_login(None, user)

        tokens = user.tokens()
        name = user.get_name()

        return {
            'email': user.email,
            'name': name,
            'access_token': tokens['access'],
            'refresh_token': tokens['refresh']
        }


class UserRecordSerializer(serializers.ModelSerializer):

    class Meta:
        model = LearningHistory
        fields = "__all__"
