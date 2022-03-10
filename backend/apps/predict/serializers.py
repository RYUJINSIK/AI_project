from rest_framework import serializers

from .models import RecordVideo


class VideoSerializer(serializers.ModelSerializer):
    '''
        RecordVideo model을 위한 serializer
    '''

    class Meta:
        model = RecordVideo
        fields = ["user_id", "video_url"]
