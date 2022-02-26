from rest_framework import serializers

from .models import SignCenter


class CenterSerializer(serializers.ModelSerializer):
    class Meta:
        model = SignCenter
        fields = '__all__'
