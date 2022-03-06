from rest_framework import serializers

from .models import RecordVideo
from .utils import video_resolution


class VideoSerializer(serializers.ModelSerializer):
    """
    비디오 등록.
    """

    class Meta:
        model = RecordVideo
        fields = ["user_id", "video_url"]


class VideoUpdateSerializer(serializers.ModelSerializer):
    """
    비디오 해상도 변경
    """
    class Meta:
        model = RecordVideo
        fields = ["user_id"]
