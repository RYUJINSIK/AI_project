from rest_framework import serializers
from rest_framework.exceptions import NotFound

from .models import RecordVideo
from .video import video_resolution


class VideoSerializer(serializers.ModelSerializer):
    """
    비디오 등록.
    """

    class Meta:
        model = RecordVideo
        fields = ["user_id", "video_url"]

    def validate(self, attrs):
        """
        user_id가 존재하는가 검증.
        """
        try:
            self.user_id = attrs["user_id"]
        except Exception:
            raise NotFound("Not Found", 404)

        return attrs


class VideoUpdateSerializer(serializers.ModelSerializer):
    """
    비디오 해상도 변경
    """

    class Meta:
        model = RecordVideo
        fields = ["user_id", "video_url"]

    def validate(self, attrs):
        """
        Patch API
        1. 사용자의 가장 최근 영상의 해상도를 변경하고 .avi 확장자로 변경한다.
        2. 해당 변경된 파일이름을 DB에 Patch한다.
        """
        try:
            user_id = attrs.get("user_id")
            video_obj = RecordVideo.objects.filter(user_id=user_id).last()
            video_name = video_obj.video_url
            video_name = video_resolution(str(video_name))
            video_obj.video_url = video_name
            video_obj.save()
        except Exception:
            raise NotFound("Not Found", 404)

        return super().validate(attrs)

    def save(self, **kwargs):
        try:
            print(self.video_url)
            # 토큰을 블랙리스트에 추가.
        except Exception:
            raise NotFound("Not Found", 404)
