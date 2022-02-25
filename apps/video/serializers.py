from rest_framework import serializers
from .models import Video

class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = '__all__'

'''
ModelSerializer는 원하는 필드만 지정해서 serialization이 가능하다.
'''