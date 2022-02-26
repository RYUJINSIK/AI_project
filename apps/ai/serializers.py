from rest_framework import serializers

from .models import RecordVideo


class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecordVideo
        fields = "__all__"
