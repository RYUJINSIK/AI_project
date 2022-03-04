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

    def validate(self, attrs):
        """
        Patch API
        1. 사용자의 가장 최근 영상의 해상도를 변경하고 .avi 확장자로 변경한다.
        2. 해당 변경된 파일이름을 DB에 Patch한다.
        """
        user_id = attrs.get('user_id')
        video_obj = RecordVideo.objects.filter(user_id=user_id).last()
        video_name = video_obj.video_url
        video_name = video_resolution(str(video_name))
        video_obj.video_url = video_name
        video_obj.save()

        return super().validate(attrs)

