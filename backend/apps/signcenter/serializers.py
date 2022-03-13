from rest_framework import serializers

from .models import SignCenter


class CenterSerializer(serializers.ModelSerializer):
    '''
        수어통역센터 객체 serializer
    '''

    class Meta:
        model = SignCenter
        fields = "__all__"
