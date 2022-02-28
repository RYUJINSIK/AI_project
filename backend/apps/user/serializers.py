from rest_framework import serializers

from .models import User


class UserCreateSerializer(serializers.ModelSerializer):

    def create(self, validated_data):
        user = User.objects.create_user(  # User 생성
            email=validated_data['email'],
            name=validated_data['name'],
            password=validated_data['password']
        )
        # user.set_password(validated_data['password'])

        # user.save()
        return user

    class Meta:
        model = User
        fields = ['email', 'name', 'password']


class IdCheckSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email']

    def validate(self, attrs):
        if User.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError(
                {'email', ('해당 이메일은 이미 사용중입니다.')})
        return super().validate(attrs)
