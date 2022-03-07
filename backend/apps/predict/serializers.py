from rest_framework import serializers

from .models import RecordVideo


class VideoSerializer(serializers.ModelSerializer):
    """
    비디오 등록.
    """

    class Meta:
        model = RecordVideo
        fields = ["user_id", "video_url"]
